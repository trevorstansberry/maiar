import { Router } from 'express'
import { randomUUID } from 'crypto'
import { db } from '../lib/db.js'
import { campaigns, conversations } from '../db/schema.js'
import { eq, and, desc } from 'drizzle-orm'
import { requireAuth } from '../lib/auth.js'

export const campaignRouter = Router()

campaignRouter.use(requireAuth)

// List campaigns for current user's workspace
campaignRouter.get('/', async (req, res) => {
  const { clientSlug } = req.user

  const rows = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.clientSlug, clientSlug))
    .orderBy(desc(campaigns.updatedAt))

  // Count affiliated conversations per campaign
  const withMeta = await Promise.all(rows.map(async (campaign) => {
    const convs = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.campaignId, campaign.id))
    const assetPlan = campaign.assetPlan ?? []
    return {
      ...campaign,
      conversationCount: convs.length,
      assetCount: assetPlan.length,
      completedAssets: assetPlan.filter(a => a.status === 'done').length
    }
  }))

  res.json(withMeta)
})

// Get campaign detail
campaignRouter.get('/:id', async (req, res) => {
  const { clientSlug } = req.user

  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, req.params.id), eq(campaigns.clientSlug, clientSlug)))

  if (!campaign) {
    return res.status(404).json({ error: 'Not found' })
  }

  // Get affiliated conversations
  const convs = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt
    })
    .from(conversations)
    .where(eq(conversations.campaignId, campaign.id))
    .orderBy(desc(conversations.createdAt))

  res.json({ ...campaign, conversations: convs })
})

// Create campaign
campaignRouter.post('/', async (req, res) => {
  const { clientSlug, id: userId } = req.user
  const { title, planPath, assetPlan } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Title required' })
  }

  const id = randomUUID()

  await db.insert(campaigns).values({
    id,
    userId,
    clientSlug,
    title: title.trim(),
    planPath: planPath ?? null,
    assetPlan: assetPlan ?? []
  })

  res.json({ id, title: title.trim() })
})

// Update campaign
campaignRouter.patch('/:id', async (req, res) => {
  const { clientSlug } = req.user
  const { title, status, assetPlan } = req.body

  const [existing] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(and(eq(campaigns.id, req.params.id), eq(campaigns.clientSlug, clientSlug)))

  if (!existing) {
    return res.status(404).json({ error: 'Not found' })
  }

  const updates = { updatedAt: new Date() }
  if (title) updates.title = title.trim()
  if (status) updates.status = status
  if (assetPlan !== undefined) updates.assetPlan = assetPlan

  await db.update(campaigns).set(updates).where(eq(campaigns.id, req.params.id))
  res.json({ ok: true })
})

// Delete campaign
campaignRouter.delete('/:id', async (req, res) => {
  const { clientSlug } = req.user

  const [existing] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(and(eq(campaigns.id, req.params.id), eq(campaigns.clientSlug, clientSlug)))

  if (!existing) {
    return res.status(404).json({ error: 'Not found' })
  }

  // Unlink conversations first
  await db.update(conversations)
    .set({ campaignId: null })
    .where(eq(conversations.campaignId, req.params.id))

  await db.delete(campaigns).where(eq(campaigns.id, req.params.id))
  res.json({ ok: true })
})

// Link conversation to campaign
campaignRouter.post('/:id/conversations', async (req, res) => {
  const { clientSlug, id: userId } = req.user
  const { conversationId } = req.body

  if (!conversationId) {
    return res.status(400).json({ error: 'conversationId required' })
  }

  // Verify campaign belongs to this workspace
  const [campaign] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(and(eq(campaigns.id, req.params.id), eq(campaigns.clientSlug, clientSlug)))

  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' })
  }

  await db.update(conversations)
    .set({ campaignId: req.params.id })
    .where(and(
      eq(conversations.id, conversationId),
      eq(conversations.userId, userId),
      eq(conversations.clientSlug, clientSlug)
    ))

  res.json({ ok: true })
})

// Unlink conversation from campaign
campaignRouter.delete('/:id/conversations/:convId', async (req, res) => {
  await db.update(conversations)
    .set({ campaignId: null })
    .where(and(
      eq(conversations.id, req.params.convId),
      eq(conversations.campaignId, req.params.id)
    ))

  res.json({ ok: true })
})
