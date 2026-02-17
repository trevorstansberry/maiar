import { Router } from 'express'
import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import { db } from '../lib/db.js'
import { users, usageLogs } from '../db/schema.js'
import { eq, sql, gte } from 'drizzle-orm'
import { requireAuth, requireAdmin } from '../lib/auth.js'
import { ensureClientDirs } from '../lib/fileSystem.js'
import { config } from '../lib/config.js'
import { existsSync, cpSync, mkdirSync } from 'fs'
import { join } from 'path'

export const adminRouter = Router()

adminRouter.use(requireAuth, requireAdmin)

// List all clients
adminRouter.get('/clients', async (req, res) => {
  const clients = await db
    .select({
      id: users.id,
      email: users.email,
      clientSlug: users.clientSlug,
      role: users.role,
      active: users.active,
      createdAt: users.createdAt
    })
    .from(users)
    .orderBy(users.createdAt)

  res.json(clients)
})

// Create a new client or admin
adminRouter.post('/clients', async (req, res) => {
  const { email, password, clientSlug, displayName, role: requestedRole } = req.body
  const role = requestedRole === 'admin' ? 'admin' : 'client'

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

// Toggle client active state
adminRouter.post('/clients/:id/toggle', async (req, res) => {
  const [user] = await db.select({ active: users.active }).from(users).where(eq(users.id, req.params.id))
  if (!user) return res.status(404).json({ error: 'Not found' })

  await db.update(users).set({ active: !user.active }).where(eq(users.id, req.params.id))
  res.json({ ok: true, active: !user.active })
})

// Usage summary — current month
adminRouter.get('/usage', async (req, res) => {
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
})

// CSV export
adminRouter.get('/usage.csv', async (req, res) => {
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
})
