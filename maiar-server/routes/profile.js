import { Router } from 'express'
import { requireAuth } from '../lib/auth.js'
import { db } from '../lib/db.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { mkdirSync, renameSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const avatarDir = join(__dirname, '..', 'ui', 'static', 'avatars')
mkdirSync(avatarDir, { recursive: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: avatarDir,
    filename: (req, file, cb) => {
      const ext = file.mimetype === 'image/png' ? '.png' : file.mimetype === 'image/webp' ? '.webp' : '.jpg'
      cb(null, `${req.user.id}${ext}`)
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, or WebP images are allowed'))
    }
  }
})

export const profileRouter = Router()
profileRouter.use(requireAuth)

// GET /api/profile — full profile for current user
profileRouter.get('/', async (req, res) => {
  try {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
      companyName: users.companyName,
      companyLogo: users.companyLogo,
      companyWebsite: users.companyWebsite,
      role: users.role,
      clientSlug: users.clientSlug,
      createdAt: users.createdAt
    }).from(users).where(eq(users.id, req.user.id))

    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json(user)
  } catch (err) {
    console.error('[profile GET]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PATCH /api/profile — update name, company fields
profileRouter.patch('/', async (req, res) => {
  try {
    const { name, companyName, companyWebsite } = req.body

    const updates = {}
    if (name !== undefined) updates.name = name?.trim() || null
    if (companyName !== undefined) updates.companyName = companyName?.trim() || null
    if (companyWebsite !== undefined) updates.companyWebsite = companyWebsite?.trim() || null

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    await db.update(users).set(updates).where(eq(users.id, req.user.id))
    res.json({ ok: true })
  } catch (err) {
    console.error('[profile PATCH]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/profile/avatar — upload avatar
profileRouter.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const avatarUrl = `/avatars/${req.file.filename}`
    await db.update(users).set({ avatarUrl }).where(eq(users.id, req.user.id))
    res.json({ ok: true, avatarUrl })
  } catch (err) {
    console.error('[profile avatar]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/profile/company-logo — upload company logo
profileRouter.post('/company-logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const ext = req.file.filename.split('.').pop()
    const logoFilename = `company-${req.user.id}.${ext}`
    renameSync(join(avatarDir, req.file.filename), join(avatarDir, logoFilename))

    const companyLogo = `/avatars/${logoFilename}`
    await db.update(users).set({ companyLogo }).where(eq(users.id, req.user.id))
    res.json({ ok: true, companyLogo })
  } catch (err) {
    console.error('[profile company-logo]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
