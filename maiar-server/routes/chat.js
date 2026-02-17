import { Router } from 'express'
import { randomUUID } from 'crypto'
import { streamChat } from '../lib/claude.js'
import { buildSystemPrompt } from '../lib/systemPrompt.js'
import { writeFile } from '../lib/fileSystem.js'
import { db } from '../lib/db.js'
import { usageLogs, conversations, users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { config, CONTENT_COMMANDS } from '../lib/config.js'
import { requireAuth } from '../lib/auth.js'

export const chatRouter = Router()

chatRouter.use(requireAuth)

chatRouter.post('/', async (req, res) => {
  const { message, history = [], conversationId } = req.body
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

  try {
    const systemPrompt = buildSystemPrompt(clientSlug)
    let fullResponse = ''

    await streamChat(
      systemPrompt,
      safeHistory,
      message,
      (text) => {
        fullResponse += text
        sendEvent({ type: 'delta', text })
      },
      async ({ inputTokens, outputTokens }) => {
        // Detect command for auto-save + usage logging
        const command = message.trim().split(/\s+/)[0].toLowerCase()
        let savedTo = null

        if (CONTENT_COMMANDS.has(command)) {
          const timestamp = new Date().toISOString().slice(0, 10)
          const slug = command.replace('/', '')
          const filename = `${timestamp}-${slug}-${randomUUID().slice(0, 8)}.md`
          const filePath = `drafts/${filename}`

          try {
            writeFile(clientSlug, filePath, fullResponse)
            savedTo = filePath
          } catch (err) {
            console.error('Auto-save failed:', err)
          }
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
          console.error('Usage log failed:', err)
        }

        // Persist conversation — store brief reference for content commands, not full text.
        // Full text lives on disk; this keeps conversation history lean for multi-turn.
        try {
          const wordCount = fullResponse.trim().split(/\s+/).filter(Boolean).length
          const storedContent = savedTo
            ? `[Draft saved to ${savedTo} · ${wordCount} words]`
            : fullResponse

          const updatedMessages = [
            ...safeHistory,
            { role: 'user', content: message },
            { role: 'assistant', content: storedContent, savedTo: savedTo ?? null }
          ]

          if (conversationId) {
            await db.update(conversations)
              .set({
                messages: JSON.stringify(updatedMessages),
                updatedAt: new Date()
              })
              .where(eq(conversations.id, conversationId))
          } else {
            // New conversation — create it
            const title = message.slice(0, 60).trim()
            const newId = randomUUID()
            await db.insert(conversations).values({
              id: newId,
              userId,
              title,
              messages: JSON.stringify(updatedMessages)
            })
            sendEvent({ type: 'conversation_id', id: newId })
          }
        } catch (err) {
          console.error('Conversation persist failed:', err)
        }

        sendEvent({ type: 'done', inputTokens, outputTokens, savedTo })
        res.end()
      }
    )
  } catch (err) {
    console.error('Chat error:', err)
    sendEvent({ type: 'error', message: err.message ?? 'Something went wrong' })
    res.end()
  }
})

// Conversation management
chatRouter.get('/conversations', async (req, res) => {
  const { id: userId } = req.user
  const rows = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt
    })
    .from(conversations)
    .where(eq(conversations.userId, userId))
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

  // H5: verify conversation belongs to this user AND this client
  if (!row || row.userId !== userId) {
    return res.status(404).json({ error: 'Not found' })
  }

  // Verify the conversation owner shares this client workspace
  const [owner] = await db.select({ clientSlug: users.clientSlug }).from(users).where(eq(users.id, row.userId))
  if (!owner || owner.clientSlug !== clientSlug) {
    return res.status(404).json({ error: 'Not found' })
  }

  res.json({ ...row, messages: JSON.parse(row.messages ?? '[]') })
})

chatRouter.delete('/conversations/:id', async (req, res) => {
  const { id: userId, clientSlug } = req.user
  const [row] = await db
    .select({ userId: conversations.userId })
    .from(conversations)
    .where(eq(conversations.id, req.params.id))

  if (!row || row.userId !== userId) {
    return res.status(404).json({ error: 'Not found' })
  }

  // H5: verify conversation owner shares this client workspace
  const [owner] = await db.select({ clientSlug: users.clientSlug }).from(users).where(eq(users.id, row.userId))
  if (!owner || owner.clientSlug !== clientSlug) {
    return res.status(404).json({ error: 'Not found' })
  }

  await db.delete(conversations).where(eq(conversations.id, req.params.id))
  res.json({ ok: true })
})
