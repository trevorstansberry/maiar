import { Router } from 'express'
import { randomUUID, createHash, randomBytes } from 'crypto'
import bcrypt from 'bcrypt'
import { db } from '../lib/db.js'
import { users, usageLogs, clients, assets, passwordResetTokens, sessions } from '../db/schema.js'
import { eq, sql, gte, desc, lt } from 'drizzle-orm'
import { requireAuth, requireAdmin, requireClientAdmin, lucia } from '../lib/auth.js'
import { ensureClientDirs } from '../lib/fileSystem.js'
import { config } from '../lib/config.js'
import { existsSync, cpSync, mkdirSync } from 'fs'
import { join } from 'path'
import { sendPasswordResetEmail } from '../lib/email.js'

export const adminRouter = Router()

// ── Super admin routes ──────────────────────────────────────────────

// List all users (super admin only)
adminRouter.get('/clients', requireAuth, requireAdmin, async (req, res) => {
  try {
    const clients = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        clientSlug: users.clientSlug,
        role: users.role,
        active: users.active,
        createdAt: users.createdAt
      })
      .from(users)
      .orderBy(users.createdAt)

    res.json(clients)
  } catch (err) {
    console.error('[admin] list clients error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create a new user (super admin only)
adminRouter.post('/clients', requireAuth, requireAdmin, async (req, res) => {
  const { email, password, clientSlug, displayName, role: requestedRole } = req.body
  const validRoles = ['client', 'client_admin', 'super_admin']
  const role = validRoles.includes(requestedRole) ? requestedRole : 'client'

  if (!email || !password || !clientSlug) {
    return res.status(400).json({ error: 'email, password, and clientSlug required' })
  }

  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(clientSlug)) {
    return res.status(400).json({ error: 'clientSlug must be 1-63 lowercase letters, numbers, or hyphens (no leading/trailing hyphens)' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const id = randomUUID()

  try {
    await db.insert(users).values({
      id,
      email: email.toLowerCase(),
      passwordHash,
      clientSlug,
      role,
      name: displayName ?? null,
      active: true
    })
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Email already exists' })
    }
    console.error('Create client error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }

  // Create workspace from master template
  ensureClientDirs(clientSlug)

  // Copy master context templates for a better starting point
  const masterContext = join(config.maiarMaster, 'context')
  const clientContext = join(config.maiarRoot, 'clients', clientSlug, 'context')
  if (existsSync(masterContext)) {
    try {
      cpSync(masterContext, clientContext, { recursive: true })
    } catch {}
  }

  res.status(201).json({ ok: true, id, clientSlug })
})

// Toggle client active state (super admin only)
adminRouter.post('/clients/:id/toggle', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [user] = await db.select({ active: users.active }).from(users).where(eq(users.id, req.params.id))
    if (!user) return res.status(404).json({ error: 'Not found' })

    await db.update(users).set({ active: !user.active }).where(eq(users.id, req.params.id))
    res.json({ ok: true, active: !user.active })
  } catch (err) {
    console.error('[admin] toggle error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Usage summary — all users, current month (super admin only)
adminRouter.get('/usage', requireAuth, requireAdmin, async (req, res) => {
  try {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const rows = await db.all(sql`
      SELECT
        u.id,
        u.email,
        u.client_slug,
        COALESCE(SUM(l.input_tokens), 0) as total_input,
        COALESCE(SUM(l.output_tokens), 0) as total_output,
        COALESCE(COUNT(l.id), 0) as request_count,
        ROUND((COALESCE(SUM(l.input_tokens), 0) * 3.0 + COALESCE(SUM(l.output_tokens), 0) * 15.0) / 1000000.0, 4) as est_cost_usd
      FROM users u
      LEFT JOIN usage_logs l ON l.user_id = u.id AND l.timestamp >= ${startOfMonth.getTime()}
      GROUP BY u.id
      ORDER BY total_output DESC
    `)

    res.json(rows)
  } catch (err) {
    console.error('[admin] usage error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// CSV export (super admin only)
adminRouter.get('/usage.csv', requireAuth, requireAdmin, async (req, res) => {
  try {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const rows = await db.all(sql`
      SELECT
        u.email,
        u.client_slug,
        l.command,
        l.input_tokens,
        l.output_tokens,
        l.timestamp
      FROM usage_logs l
      JOIN users u ON l.user_id = u.id
      WHERE l.timestamp >= ${startOfMonth.getTime()}
      ORDER BY l.timestamp DESC
    `)

    const csvField = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"'
    const header = 'email,client_slug,command,input_tokens,output_tokens,timestamp\n'
    const body = rows.map(r =>
      [r.email, r.client_slug, r.command ?? '', r.input_tokens, r.output_tokens, new Date(r.timestamp).toISOString()]
        .map(csvField).join(',')
    ).join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="maiar-usage-${new Date().toISOString().slice(0,7)}.csv"`)
    res.send(header + body)
  } catch (err) {
    console.error('[admin] csv export error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ── Workspace management (super admin only) ────────────────────────

// List all workspaces with user counts + aggregate usage
adminRouter.get('/workspaces', requireAuth, requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(clients).orderBy(desc(clients.createdAt))

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const withMeta = await Promise.all(rows.map(async (client) => {
      // Count users in this workspace
      const userRows = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clientSlug, client.slug))

      // Aggregate usage for this workspace
      const [usage] = await db.all(sql`
        SELECT
          COALESCE(SUM(l.input_tokens), 0) as total_input,
          COALESCE(SUM(l.output_tokens), 0) as total_output,
          COALESCE(COUNT(l.id), 0) as request_count
        FROM users u
        LEFT JOIN usage_logs l ON l.user_id = u.id AND l.timestamp >= ${startOfMonth.getTime()}
        WHERE u.client_slug = ${client.slug}
      `)

      // Count assets in this workspace
      const assetRows = await db
        .select({ id: assets.id })
        .from(assets)
        .where(eq(assets.clientSlug, client.slug))

      return {
        ...client,
        userCount: userRows.length,
        assetCount: assetRows.length,
        totalInput: usage?.total_input ?? 0,
        totalOutput: usage?.total_output ?? 0,
        requestCount: usage?.request_count ?? 0
      }
    }))

    res.json(withMeta)
  } catch (err) {
    console.error('[admin] list workspaces error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create workspace
adminRouter.post('/workspaces', requireAuth, requireAdmin, async (req, res) => {
  const { slug, displayName } = req.body

  if (!slug || !displayName) {
    return res.status(400).json({ error: 'slug and displayName required' })
  }

  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(slug)) {
    return res.status(400).json({ error: 'slug must be 1-63 lowercase letters, numbers, or hyphens' })
  }

  const id = randomUUID()

  try {
    await db.insert(clients).values({ id, slug, displayName: displayName.trim() })
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Workspace slug already exists' })
    }
    console.error('[admin] create workspace error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }

  // Create directory structure
  ensureClientDirs(slug)

  // Copy master context templates
  const masterContext = join(config.maiarMaster, 'context')
  const clientContext = join(config.maiarRoot, 'clients', slug, 'context')
  if (existsSync(masterContext)) {
    try {
      cpSync(masterContext, clientContext, { recursive: true })
    } catch {}
  }

  res.status(201).json({ ok: true, id, slug })
})

// Update workspace (displayName, active, prioritySkills)
adminRouter.patch('/workspaces/:id', requireAuth, requireAdmin, async (req, res) => {
  const { displayName, active, prioritySkills } = req.body

  const [existing] = await db.select({ id: clients.id }).from(clients).where(eq(clients.id, req.params.id))
  if (!existing) return res.status(404).json({ error: 'Not found' })

  const updates = {}
  if (displayName) updates.displayName = displayName.trim()
  if (active !== undefined) updates.active = active
  if (prioritySkills !== undefined) {
    if (!Array.isArray(prioritySkills)) return res.status(400).json({ error: 'prioritySkills must be an array' })
    updates.prioritySkills = JSON.stringify(prioritySkills)
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nothing to update' })
  }

  await db.update(clients).set(updates).where(eq(clients.id, req.params.id))
  res.json({ ok: true })
})

// Get workspace users
adminRouter.get('/workspaces/:id/users', requireAuth, requireAdmin, async (req, res) => {
  const [workspace] = await db.select().from(clients).where(eq(clients.id, req.params.id))
  if (!workspace) return res.status(404).json({ error: 'Not found' })

  const workspaceUsers = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      active: users.active,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.clientSlug, workspace.slug))
    .orderBy(users.createdAt)

  res.json(workspaceUsers)
})

// ── Bot persona management ───────────────────────────────────────────

// Get workspace for current user (any authenticated user)
adminRouter.get('/my/workspace', requireAuth, async (req, res) => {
  try {
    const [workspace] = await db.select().from(clients).where(eq(clients.slug, req.user.clientSlug))
    if (!workspace) return res.status(404).json({ error: 'Workspace not found' })
    res.json(workspace)
  } catch (err) {
    console.error('[admin] my workspace error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update workspace persona (super_admin for any, client_admin for own)
adminRouter.patch('/workspaces/:id/persona', requireAuth, requireClientAdmin, async (req, res) => {
  try {
    const { botName, botPersonality, botAvatarUrl } = req.body
    const [workspace] = await db.select().from(clients).where(eq(clients.id, req.params.id))
    if (!workspace) return res.status(404).json({ error: 'Not found' })

    // Client admins can only edit their own workspace
    if (req.user.role === 'client_admin' && workspace.slug !== req.user.clientSlug) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const updates = {}
    if (botName !== undefined) updates.botName = botName?.trim() || null
    if (botPersonality !== undefined) updates.botPersonality = botPersonality?.trim() || null
    if (botAvatarUrl !== undefined) {
      const trimmed = botAvatarUrl?.trim() || null
      if (trimmed && !trimmed.startsWith('https://') && !trimmed.startsWith('/avatars/')) {
        return res.status(400).json({ error: 'botAvatarUrl must be an HTTPS URL or a local /avatars/ path' })
      }
      updates.botAvatarUrl = trimmed
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' })
    }

    await db.update(clients).set(updates).where(eq(clients.id, req.params.id))
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin] update persona error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ── Client admin routes (scoped to own workspace) ───────────────────

// List users in my workspace
adminRouter.get('/my/users', requireAuth, requireClientAdmin, async (req, res) => {
  try {
    const myUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        clientSlug: users.clientSlug,
        role: users.role,
        active: users.active,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.clientSlug, req.user.clientSlug))
      .orderBy(users.createdAt)

    res.json(myUsers)
  } catch (err) {
    console.error('[admin] my users error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create user in my workspace (client_admin can only create 'client' role)
adminRouter.post('/my/users', requireAuth, requireClientAdmin, async (req, res) => {
  const { email, password, displayName } = req.body
  const clientSlug = req.user.clientSlug
  const role = 'client' // client admins cannot create admins

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const id = randomUUID()

  try {
    await db.insert(users).values({
      id,
      email: email.toLowerCase(),
      passwordHash,
      clientSlug,
      role,
      name: displayName ?? null,
      active: true
    })
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Email already exists' })
    }
    console.error('[admin] create my user error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }

  res.status(201).json({ ok: true, id, clientSlug })
})

// Update priority skills for my workspace (client admin self-service)
adminRouter.patch('/my/workspace/skills', requireAuth, requireClientAdmin, async (req, res) => {
  try {
    const { prioritySkills } = req.body
    if (!Array.isArray(prioritySkills)) return res.status(400).json({ error: 'prioritySkills must be an array' })

    const [workspace] = await db.select({ id: clients.id }).from(clients)
      .where(eq(clients.slug, req.user.clientSlug))
    if (!workspace) return res.status(404).json({ error: 'Workspace not found' })

    await db.update(clients)
      .set({ prioritySkills: JSON.stringify(prioritySkills) })
      .where(eq(clients.id, workspace.id))
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin] update my skills error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Toggle user in my workspace (client admin)
adminRouter.post('/my/users/:id/toggle', requireAuth, requireClientAdmin, async (req, res) => {
  try {
    const [target] = await db.select({ active: users.active, clientSlug: users.clientSlug })
      .from(users).where(eq(users.id, req.params.id))
    if (!target) return res.status(404).json({ error: 'Not found' })
    if (target.clientSlug !== req.user.clientSlug) return res.status(403).json({ error: 'Access denied' })

    await db.update(users).set({ active: !target.active }).where(eq(users.id, req.params.id))
    res.json({ ok: true, active: !target.active })
  } catch (err) {
    console.error('[admin] toggle my user error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ── User management (Phases 4) ─────────────────────────────────────

// Edit user (super admin: all fields; client admin: name only, own workspace)
adminRouter.patch('/clients/:id', requireAuth, requireClientAdmin, async (req, res) => {
  try {
    const [target] = await db.select().from(users).where(eq(users.id, req.params.id))
    if (!target) return res.status(404).json({ error: 'Not found' })

    if (req.user.role === 'client_admin' && target.clientSlug !== req.user.clientSlug) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const updates = {}
    const { name, email, role } = req.body

    if (req.user.role === 'super_admin') {
      if (name !== undefined) updates.name = name?.trim() || null
      if (email) updates.email = email.toLowerCase()
      if (role && ['client', 'client_admin', 'super_admin'].includes(role)) {
        if (target.id !== req.user.id) updates.role = role
      }
    } else {
      if (name !== undefined) updates.name = name?.trim() || null
    }

    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' })

    await db.update(users).set(updates).where(eq(users.id, target.id))
    res.json({ ok: true })
  } catch (err) {
    if (err.message?.includes('UNIQUE')) return res.status(409).json({ error: 'Email already in use' })
    console.error('[admin] edit user error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Send password reset link for a user (admin-initiated)
adminRouter.post('/clients/:id/send-reset-link', requireAuth, requireClientAdmin, async (req, res) => {
  try {
    const [target] = await db.select({ id: users.id, email: users.email, clientSlug: users.clientSlug })
      .from(users).where(eq(users.id, req.params.id))
    if (!target) return res.status(404).json({ error: 'Not found' })

    if (req.user.role === 'client_admin' && target.clientSlug !== req.user.clientSlug) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const now = Math.floor(Date.now() / 1000)
    const rawToken = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(rawToken).digest('hex')

    // Clean up existing tokens for this user
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, target.id))

    await db.insert(passwordResetTokens).values({
      id: randomUUID(),
      userId: target.id,
      tokenHash,
      expiresAt: now + 1800
    })

    const resetUrl = `${config.appUrl}/reset-password?token=${rawToken}`
    await sendPasswordResetEmail(target.email, resetUrl)

    res.json({ ok: true })
  } catch (err) {
    console.error('[admin] send reset link error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Set temp password directly (super admin only)
adminRouter.post('/clients/:id/set-password', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [target] = await db.select({ id: users.id }).from(users).where(eq(users.id, req.params.id))
    if (!target) return res.status(404).json({ error: 'Not found' })

    const { password } = req.body
    if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })

    const passwordHash = await bcrypt.hash(password, 12)
    await db.update(users).set({ passwordHash, mustChangePassword: true }).where(eq(users.id, target.id))
    await lucia.invalidateUserSessions(target.id)

    res.json({ ok: true })
  } catch (err) {
    console.error('[admin] set password error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete user (super admin only)
adminRouter.delete('/clients/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [target] = await db.select({ id: users.id }).from(users).where(eq(users.id, req.params.id))
    if (!target) return res.status(404).json({ error: 'Not found' })

    if (target.id === req.user.id) return res.status(400).json({ error: 'Cannot delete your own account' })

    await lucia.invalidateUserSessions(target.id)
    await db.delete(users).where(eq(users.id, target.id))
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin] delete user error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Send reset link for user in my workspace (client admin)
adminRouter.post('/my/users/:id/send-reset-link', requireAuth, requireClientAdmin, async (req, res) => {
  try {
    const [target] = await db.select({ id: users.id, email: users.email, clientSlug: users.clientSlug })
      .from(users).where(eq(users.id, req.params.id))
    if (!target) return res.status(404).json({ error: 'Not found' })
    if (target.clientSlug !== req.user.clientSlug) return res.status(403).json({ error: 'Access denied' })

    const now = Math.floor(Date.now() / 1000)
    const rawToken = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(rawToken).digest('hex')

    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, target.id))
    await db.insert(passwordResetTokens).values({
      id: randomUUID(),
      userId: target.id,
      tokenHash,
      expiresAt: now + 1800
    })

    const resetUrl = `${config.appUrl}/reset-password?token=${rawToken}`
    await sendPasswordResetEmail(target.email, resetUrl)

    res.json({ ok: true })
  } catch (err) {
    console.error('[admin] send my user reset link error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Usage for my workspace only
adminRouter.get('/my/usage', requireAuth, requireClientAdmin, async (req, res) => {
  try {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const rows = await db.all(sql`
      SELECT
        u.id,
        u.email,
        u.client_slug,
        COALESCE(SUM(l.input_tokens), 0) as total_input,
        COALESCE(SUM(l.output_tokens), 0) as total_output,
        COALESCE(COUNT(l.id), 0) as request_count,
        ROUND((COALESCE(SUM(l.input_tokens), 0) * 3.0 + COALESCE(SUM(l.output_tokens), 0) * 15.0) / 1000000.0, 4) as est_cost_usd
      FROM users u
      LEFT JOIN usage_logs l ON l.user_id = u.id AND l.timestamp >= ${startOfMonth.getTime()}
      WHERE u.client_slug = ${req.user.clientSlug}
      GROUP BY u.id
      ORDER BY total_output DESC
    `)

    res.json(rows)
  } catch (err) {
    console.error('[admin] my usage error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
