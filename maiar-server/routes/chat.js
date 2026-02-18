import { Router } from 'express'
import { randomUUID } from 'crypto'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import { streamChat } from '../lib/claude.js'
import { buildSystemPrompt, buildCommandPrompt, loadSkills } from '../lib/systemPrompt.js'
import { writeFile } from '../lib/fileSystem.js'
import { db } from '../lib/db.js'
import { usageLogs, conversations, users, assets, clients, campaigns } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import { config, CONTENT_COMMANDS } from '../lib/config.js'
import { requireAuth } from '../lib/auth.js'
import { resolveCommand, resolveIntent } from '../lib/commandRegistry.js'
import { runAgentChain } from '../lib/agentRunner.js'
import { classifyIntent } from '../lib/intentClassifier.js'
import { GUIDED_FLOWS, INTENT_TO_COMMAND } from '../lib/guidedFlows.js'
import { createContentRouter } from '../lib/contentRouter.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

export const chatRouter = Router()

chatRouter.use(requireAuth)

const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 60,
  keyGenerator: (req) => req.user?.id ?? req.ip,
  message: { error: 'Too many requests — please try again later' }
})

// --- Smart title generation ---

const COMMAND_LABELS = {
  '/write': null, // detect format from message
  '/email': 'Email',
  '/social': 'Social Post',
  '/campaign': 'Campaign',
  '/ads': 'Ad Copy',
  '/audit': 'Audit',
  '/research': 'Research Brief',
  '/strategy': 'Strategy',
  '/ideas': 'Ideas',
  '/competitor': 'Competitor Analysis',
  '/lifecycle': 'Lifecycle',
  '/persona': 'Persona',
  '/brand-positioning': 'Brand Positioning',
  '/influencer': 'Influencer Brief',
  '/repurpose': 'Repurpose',
  '/analyze': 'Analysis',
  '/optimize': 'Optimization',
  '/abm': 'ABM Plan',
  '/publish': 'Publish',
  '/performance-review': 'Performance Review',
  '/brand-research': 'Brand Research'
}

const WRITE_FORMATS = [
  ['blog post', 'Blog Post'], ['landing page', 'Landing Page'], ['case study', 'Case Study'],
  ['white paper', 'White Paper'], ['whitepaper', 'White Paper'], ['press release', 'Press Release'],
  ['newsletter', 'Newsletter'], ['guide', 'Guide'], ['ebook', 'Ebook'], ['tutorial', 'Tutorial'],
  ['how-to', 'How-To'], ['listicle', 'Listicle'], ['product page', 'Product Page'],
  ['sales page', 'Sales Page'], ['about page', 'About Page'], ['faq', 'FAQ']
]

const FILLER = /^(a|an|the|about|for|on|in|to|with|my|our|their|your|some|new|and|or|of)\s+/i

function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase())
}

function generateTitle(message) {
  const trimmed = message.trim()
  const parts = trimmed.split(/\s+/)
  const cmd = parts[0]?.toLowerCase()

  if (cmd && COMMAND_LABELS[cmd] !== undefined) {
    const rest = parts.slice(1).join(' ')

    // For /write, detect the format
    let label = COMMAND_LABELS[cmd]
    let topic = rest

    if (cmd === '/write') {
      label = 'Content' // default
      const lower = rest.toLowerCase()
      for (const [pattern, fmt] of WRITE_FORMATS) {
        if (lower.startsWith(pattern)) {
          label = fmt
          topic = rest.slice(pattern.length).trim()
          break
        }
      }
    }

    // Strip filler words from topic start
    topic = topic.replace(FILLER, '').trim()

    if (topic) {
      // Capitalize and truncate to ~50 chars at word boundary
      topic = titleCase(topic)
      if (topic.length > 50) {
        topic = topic.slice(0, 50).replace(/\s+\S*$/, '')
      }
      return `${topic} — ${label}`
    }

    return label
  }

  // Non-command: capitalize first ~50 chars at word boundary
  let title = titleCase(trimmed)
  if (title.length > 50) {
    title = title.slice(0, 50).replace(/\s+\S*$/, '')
  }
  return title
}

// Image upload — returns base64 for Anthropic vision API
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

chatRouter.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file || !ALLOWED_IMAGE_TYPES.has(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid image (jpeg, png, gif, webp up to 5MB)' })
  }
  res.json({
    base64: req.file.buffer.toString('base64'),
    mediaType: req.file.mimetype
  })
})

/**
 * Send structured choices to the frontend via SSE.
 * The frontend renders these as clickable cards/buttons.
 */
function sendChoices(sendEvent, { prompt, layout = 'cards', choices }) {
  sendEvent({ type: 'choices', prompt, layout, choices })
}

// createContentRouter imported from ../lib/contentRouter.js

chatRouter.post('/', chatLimiter, async (req, res) => {
  const { message, history = [], conversationId, campaignId, images } = req.body
  const { clientSlug, id: userId } = req.user

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message required' })
  }

  // C1: Only allow user/assistant roles in history — reject any system injection
  const safeHistory = (history ?? []).filter(m =>
    m.role === 'user' || m.role === 'assistant'
  )

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  let fullResponse = ''
  let canvasContent = ''

  const onDelta = (text, target = 'chat') => {
    fullResponse += text
    if (target === 'canvas') canvasContent += text
    sendEvent({ type: 'delta', text, target })
  }

  /**
   * Shared post-completion handler: auto-save, usage log, conversation persist, done event.
   */
  const handleCompletion = async ({ inputTokens, outputTokens, agentSteps }) => {
    let savedTo = null
    let newConversationId = null
    let assetTitle = null
    let campaignTitle = null

    try {
      console.log(`[chat] onDone tokens=${inputTokens}/${outputTokens} responseLen=${fullResponse.length}`)

      // Detect command for auto-save, or auto-detect long-form content
      const resolved = resolveCommand(message)
      let shouldSave = resolved?.config.producesContent ?? CONTENT_COMMANDS.has(message.trim().split(/\s+/)[0].toLowerCase())

      // Canvas auto-detection heuristic: check canvasContent first, fallback to fullResponse
      if (!shouldSave) {
        const textToCheck = canvasContent.length > 0 ? canvasContent : fullResponse
        if (textToCheck.length > 0) {
          const wordCount = textToCheck.trim().split(/\s+/).filter(Boolean).length
          const hasHeadings = /^#{1,3}\s+/m.test(textToCheck)
          if (wordCount >= 400 || (wordCount >= 200 && hasHeadings)) {
            shouldSave = true
            sendEvent({ type: 'content_detected' })
            console.log(`[chat] Auto-detected content: ${wordCount} words, headings=${hasHeadings}`)
          }
        }
      }

      if (shouldSave) {
        const timestamp = new Date().toISOString().slice(0, 10)
        const slug = message.trim().split(/\s+/)[0].toLowerCase().replace('/', '')
        const filename = `${timestamp}-${slug}-${randomUUID().slice(0, 8)}.md`
        const filePath = `drafts/${filename}`
        assetTitle = generateTitle(message)

        try {
          const contentToSave = canvasContent.length > 0 ? canvasContent : fullResponse
          writeFile(clientSlug, filePath, contentToSave)
          savedTo = filePath
          console.log(`[chat] Auto-saved to ${filePath}`)

          // Register asset in DB
          try {
            await db.insert(assets).values({
              id: randomUUID(),
              clientSlug,
              userId,
              conversationId: conversationId ?? null,
              campaignId: campaignId ?? null,
              title: assetTitle,
              filePath: savedTo,
              folder: 'drafts',
              status: 'draft'
            })
            console.log(`[chat] Asset registered for ${savedTo}`)
          } catch (assetErr) {
            console.error('[chat] Asset registration failed:', assetErr)
          }
        } catch (err) {
          console.error('[chat] Auto-save failed:', err)
        }
      }

      // Look up campaign title if linked
      if (campaignId) {
        try {
          const [camp] = await db.select({ title: campaigns.title }).from(campaigns).where(eq(campaigns.id, campaignId))
          campaignTitle = camp?.title ?? null
        } catch {}
      }

      // Log usage
      try {
        await db.insert(usageLogs).values({
          userId,
          inputTokens,
          outputTokens,
          command: message.trim().split(/\s+/)[0].slice(0, 64)
        })
      } catch (err) {
        console.error('[chat] Usage log failed:', err)
      }

      // Persist conversation — store brief reference for content commands, not full text.
      try {
        const wordCount = fullResponse.trim().split(/\s+/).filter(Boolean).length
        const storedContent = savedTo
          ? `[Draft saved to ${savedTo} · ${wordCount} words]`
          : fullResponse

        const updatedMessages = [
          ...safeHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: storedContent, savedTo: savedTo ?? null, agentSteps: agentSteps ?? null }
        ]

        if (conversationId) {
          await db.update(conversations)
            .set({
              messages: JSON.stringify(updatedMessages),
              updatedAt: new Date()
            })
            .where(eq(conversations.id, conversationId))
          console.log(`[chat] Updated conversation ${conversationId}`)
        } else {
          const title = generateTitle(message)
          newConversationId = randomUUID()
          await db.insert(conversations).values({
            id: newConversationId,
            userId,
            clientSlug,
            title,
            campaignId: campaignId ?? null,
            messages: JSON.stringify(updatedMessages)
          })
          console.log(`[chat] Created conversation ${newConversationId}`)

          // Link asset to the newly created conversation
          if (savedTo && newConversationId) {
            try {
              await db.update(assets)
                .set({ conversationId: newConversationId })
                .where(and(eq(assets.clientSlug, clientSlug), eq(assets.filePath, savedTo)))
            } catch (linkErr) {
              console.error('[chat] Asset-conversation link failed:', linkErr)
            }
          }
        }
      } catch (err) {
        console.error('[chat] Conversation persist failed:', err)
      }
    } finally {
      // ALWAYS send conversation_id (before done) and done event, even if persistence failed
      if (newConversationId) {
        sendEvent({ type: 'conversation_id', id: newConversationId })
      }
      sendEvent({ type: 'done', inputTokens, outputTokens, savedTo, assetTitle, campaignTitle, agentSteps: agentSteps ?? null })
      console.log(`[chat] Sent done event savedTo=${savedTo} agents=${agentSteps?.length ?? 0}`)
      res.end()
    }
  }

  try {
    console.log(`[chat] Stream start user=${userId} client=${clientSlug} convId=${conversationId ?? 'new'} historyLen=${safeHistory.length}`)

    // Look up bot persona and priority skills for this workspace
    const [clientRow] = await db.select({
      botName: clients.botName,
      botPersonality: clients.botPersonality,
      prioritySkills: clients.prioritySkills
    }).from(clients).where(eq(clients.slug, clientSlug))
    const persona = clientRow?.botName ? clientRow : null
    const prioritySkills = (() => {
      try { return JSON.parse(clientRow?.prioritySkills ?? '[]') } catch { return [] }
    })()

    // Build user content — plain string or array with image blocks
    const userContent = images?.length
      ? [
          ...images.map(img => ({
            type: 'image',
            source: { type: 'base64', media_type: img.mediaType, data: img.base64 }
          })),
          { type: 'text', text: message }
        ]
      : message

    // --- Routing: slash command → intent classification → general chat ---

    // 1. Check for explicit slash command first (unchanged path)
    let resolved = resolveCommand(message)

    // 2. If no slash command, classify intent via LLM
    if (!resolved) {
      const intent = await classifyIntent(message)
      console.log(`[chat] Intent classified: ${intent.intent} (${intent.confidence}) topic="${intent.topic}"`)

      // Check if this is a high-level category that needs guided choices
      if (GUIDED_FLOWS[intent.intent]) {
        console.log(`[chat] Sending guided choices for category: ${intent.intent}`)
        sendChoices(sendEvent, GUIDED_FLOWS[intent.intent])
        sendEvent({ type: 'done', inputTokens: 0, outputTokens: 0 })
        res.end()
        return
      }

      // Map specific intent to command — only when confidence is high enough
      const commandSlash = INTENT_TO_COMMAND[intent.intent]
      if (commandSlash && intent.confidence >= 0.7) {
        const intentResolved = resolveIntent(commandSlash, intent.topic)
        if (intentResolved) {
          resolved = { command: intentResolved.command, config: intentResolved.config }
          // Use the original user message (not the virtual command) for user-facing title generation
          // but the virtual message for command routing context
          console.log(`[chat] Intent routed to ${intentResolved.command} via "${intentResolved.virtualMessage}"`)
        }
      }
      // If intent is 'general' or unrecognized, resolved stays null → falls through to general chat
    }

    // Signal content commands to the frontend so canvas opens before deltas
    if (resolved?.config.producesContent) {
      sendEvent({ type: 'content_start', command: resolved.command })
    }

    if (resolved && resolved.config.agents.length > 0) {
      // Route through agent orchestration — all output to canvas
      console.log(`[chat] Command ${resolved.command} → agents: [${resolved.config.agents.join(', ')}]`)
      const label = COMMAND_LABELS[resolved.command] || 'content'
      onDelta(`Working on your ${(label || 'content').toLowerCase()}...`, 'chat')

      // Wrap sendEvent to reset canvasContent on canvas_clear — disk save captures final agent only
      const agentSendEvent = (data) => {
        if (data.type === 'canvas_clear') canvasContent = ''
        sendEvent(data)
      }

      await runAgentChain({
        clientSlug,
        userMessage: message,
        history: safeHistory,
        agentChain: resolved.config.agents,
        skills: resolved.config.skills,
        persona,
        prioritySkills,
        images,
        onDelta: (text) => onDelta(text, 'canvas'),
        sendEvent: agentSendEvent,
        onDone: async (stats) => {
          // Brief completion message in chat
          if (canvasContent.length > 0) {
            const wc = canvasContent.trim().split(/\s+/).filter(Boolean).length
            onDelta(`\n\nDone — ${wc} words saved to your drafts.`, 'chat')
          }
          await handleCompletion(stats)
        }
      })
    } else if (resolved && resolved.config.skills.length > 0) {
      // Skills-only command — use content tag router to separate chat from canvas
      console.log(`[chat] Command ${resolved.command} → skills only: [${resolved.config.skills.join(', ')}]`)
      const systemPrompt = buildCommandPrompt(clientSlug, resolved.command, resolved.config.skills, persona, prioritySkills)
      const router = createContentRouter(onDelta)

      await streamChat(
        systemPrompt,
        safeHistory,
        userContent,
        (text) => router.route(text),
        async ({ inputTokens, outputTokens }) => {
          router.flush()
          await handleCompletion({ inputTokens, outputTokens, agentSteps: null })
        }
      )
    } else {
      // General chat — use content tag router for any ad-hoc content generation
      const systemPrompt = buildSystemPrompt(clientSlug, persona, prioritySkills)
      const router = createContentRouter(onDelta)

      await streamChat(
        systemPrompt,
        safeHistory,
        userContent,
        (text) => router.route(text),
        async ({ inputTokens, outputTokens }) => {
          router.flush()
          await handleCompletion({ inputTokens, outputTokens, agentSteps: null })
        }
      )
    }
  } catch (err) {
    console.error('[chat] Chat error:', err)
    sendEvent({ type: 'error', message: 'Something went wrong' })
    res.end()
  }
})

// Conversation management
chatRouter.get('/conversations', async (req, res) => {
  const { id: userId, clientSlug } = req.user
  const rows = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt
    })
    .from(conversations)
    .where(and(eq(conversations.userId, userId), eq(conversations.clientSlug, clientSlug)))
    .orderBy(conversations.updatedAt)

  // Add message count and canvas metadata without returning full message content
  const withMeta = await Promise.all(rows.map(async (row) => {
    const [full] = await db.select({ messages: conversations.messages })
      .from(conversations)
      .where(eq(conversations.id, row.id))
    const msgs = JSON.parse(full?.messages ?? '[]')
    // Find the most recent savedTo path from any assistant message
    let canvasPath = null
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant' && msgs[i].savedTo) {
        canvasPath = msgs[i].savedTo
        break
      }
    }
    return { ...row, messageCount: msgs.length, hasSavedContent: !!canvasPath, canvasPath }
  }))

  res.json(withMeta.reverse())
})

chatRouter.get('/conversations/:id', async (req, res) => {
  const { id: userId, clientSlug } = req.user
  const [row] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, req.params.id))

  if (!row || row.userId !== userId || (row.clientSlug && row.clientSlug !== clientSlug)) {
    return res.status(404).json({ error: 'Not found' })
  }

  res.json({ ...row, messages: JSON.parse(row.messages ?? '[]') })
})

chatRouter.patch('/conversations/:id', async (req, res) => {
  const { id: userId } = req.user
  const { title } = req.body

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title required' })
  }

  const [row] = await db
    .select({ userId: conversations.userId })
    .from(conversations)
    .where(eq(conversations.id, req.params.id))

  if (!row || row.userId !== userId) {
    return res.status(404).json({ error: 'Not found' })
  }

  await db.update(conversations)
    .set({ title: title.trim().slice(0, 120) })
    .where(eq(conversations.id, req.params.id))

  res.json({ ok: true })
})

chatRouter.delete('/conversations/:id', async (req, res) => {
  const { id: userId, clientSlug } = req.user
  const [row] = await db
    .select({ userId: conversations.userId, clientSlug: conversations.clientSlug })
    .from(conversations)
    .where(eq(conversations.id, req.params.id))

  if (!row || row.userId !== userId || (row.clientSlug && row.clientSlug !== clientSlug)) {
    return res.status(404).json({ error: 'Not found' })
  }

  await db.delete(conversations).where(eq(conversations.id, req.params.id))
  res.json({ ok: true })
})
