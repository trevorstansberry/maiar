import { Router } from 'express'
import { db } from '../lib/db.js'
import { assets, conversations, campaigns } from '../db/schema.js'
import { eq, and, or, isNull } from 'drizzle-orm'
import { requireAuth } from '../lib/auth.js'

export const assetsDbRouter = Router()

assetsDbRouter.use(requireAuth)

// List assets for the current client, with optional filters
assetsDbRouter.get('/', async (req, res) => {
  const { clientSlug, id: userId } = req.user
  const { conversationId, campaignId, folder, mine } = req.query

  try {
    const conditions = [eq(assets.clientSlug, clientSlug)]
    if (conversationId) conditions.push(eq(assets.conversationId, conversationId))
    if (campaignId) conditions.push(eq(assets.campaignId, campaignId))
    if (folder) conditions.push(eq(assets.folder, folder))

    // Visibility filtering
    if (mine === 'true') {
      // Only this user's assets (including legacy rows with no userId)
      conditions.push(or(eq(assets.userId, userId), isNull(assets.userId)))
    } else {
      // User's own assets + org-visible assets
      conditions.push(or(eq(assets.userId, userId), eq(assets.visibility, 'org'), isNull(assets.userId)))
    }

    const rows = await db
      .select()
      .from(assets)
      .where(and(...conditions))
      .orderBy(assets.updatedAt)

    // Enrich with conversation title and campaign title
    const enriched = await Promise.all(rows.map(async (row) => {
      let conversationTitle = null
      let campaignTitle = null

      if (row.conversationId) {
        const [conv] = await db.select({ title: conversations.title })
          .from(conversations).where(eq(conversations.id, row.conversationId))
        conversationTitle = conv?.title ?? null
      }
      if (row.campaignId) {
        const [camp] = await db.select({ title: campaigns.title })
          .from(campaigns).where(eq(campaigns.id, row.campaignId))
        campaignTitle = camp?.title ?? null
      }

      return { ...row, conversationTitle, campaignTitle }
    }))

    res.json(enriched.reverse())
  } catch (err) {
    console.error('[assets-db] List error:', err)
    res.status(500).json({ error: 'Failed to list assets' })
  }
})

// Get single asset
assetsDbRouter.get('/:id', async (req, res) => {
  const { clientSlug } = req.user

  try {
    const [row] = await db.select().from(assets)
      .where(and(eq(assets.id, req.params.id), eq(assets.clientSlug, clientSlug)))

    if (!row) return res.status(404).json({ error: 'Not found' })

    let conversationTitle = null
    let campaignTitle = null

    if (row.conversationId) {
      const [conv] = await db.select({ title: conversations.title })
        .from(conversations).where(eq(conversations.id, row.conversationId))
      conversationTitle = conv?.title ?? null
    }
    if (row.campaignId) {
      const [camp] = await db.select({ title: campaigns.title })
        .from(campaigns).where(eq(campaigns.id, row.campaignId))
      campaignTitle = camp?.title ?? null
    }

    res.json({ ...row, conversationTitle, campaignTitle })
  } catch (err) {
    console.error('[assets-db] Get error:', err)
    res.status(500).json({ error: 'Failed to get asset' })
  }
})

// Create asset record
assetsDbRouter.post('/', async (req, res) => {
  const { clientSlug } = req.user
  const { id, title, filePath, folder, status, conversationId, campaignId } = req.body

  if (!title || !filePath || !folder) {
    return res.status(400).json({ error: 'title, filePath, and folder are required' })
  }

  try {
    const { randomUUID } = await import('crypto')
    await db.insert(assets).values({
      id: id || randomUUID(),
      clientSlug,
      userId: req.user.id,
      conversationId: conversationId ?? null,
      campaignId: campaignId ?? null,
      title,
      filePath,
      folder,
      status: status ?? 'draft'
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('[assets-db] Create error:', err)
    res.status(500).json({ error: 'Failed to create asset' })
  }
})

// Update asset record
assetsDbRouter.patch('/:id', async (req, res) => {
  const { clientSlug } = req.user
  const { title, status, campaignId } = req.body

  try {
    const [row] = await db.select({ id: assets.id }).from(assets)
      .where(and(eq(assets.id, req.params.id), eq(assets.clientSlug, clientSlug)))

    if (!row) return res.status(404).json({ error: 'Not found' })

    const updates = { updatedAt: new Date() }
    if (title !== undefined) updates.title = title
    if (status !== undefined) updates.status = status
    if (campaignId !== undefined) updates.campaignId = campaignId

    await db.update(assets).set(updates)
      .where(eq(assets.id, req.params.id))

    res.json({ ok: true })
  } catch (err) {
    console.error('[assets-db] Update error:', err)
    res.status(500).json({ error: 'Failed to update asset' })
  }
})

// Delete asset record (file stays on disk)
assetsDbRouter.delete('/:id', async (req, res) => {
  const { clientSlug } = req.user

  try {
    const [row] = await db.select({ id: assets.id }).from(assets)
      .where(and(eq(assets.id, req.params.id), eq(assets.clientSlug, clientSlug)))

    if (!row) return res.status(404).json({ error: 'Not found' })

    await db.delete(assets).where(eq(assets.id, req.params.id))
    res.json({ ok: true })
  } catch (err) {
    console.error('[assets-db] Delete error:', err)
    res.status(500).json({ error: 'Failed to delete asset' })
  }
})
