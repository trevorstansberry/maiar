import { Router } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { rateLimit } from 'express-rate-limit'
import { lucia, requireAuth } from '../lib/auth.js'
import { db } from '../lib/db.js'
import { users, passwordResetTokens, clients } from '../db/schema.js'
import { eq, and, isNull, gt, lt, isNotNull, or } from 'drizzle-orm'
import { config } from '../lib/config.js'
import { sendPasswordResetEmail } from '../lib/email.js'

export const authRouter = Router()

// --- Rate limiters ---

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
})

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: { error: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

// --- Password validation ---

/**
 * Validate password strength. Returns an error message or null if valid.
 * Rules: min 8 chars, at least one letter AND one number.
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
  return null
}

// --- Login / Logout / Session ---

authRouter.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()))

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (!user.active) {
      return res.status(403).json({ error: 'Account disabled' })
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    // Look up bot persona from client workspace
    const [clientRow] = await db.select({
      botName: clients.botName,
      botPersonality: clients.botPersonality,
      botAvatarUrl: clients.botAvatarUrl
    }).from(clients).where(eq(clients.slug, user.clientSlug))

    res.setHeader('Set-Cookie', sessionCookie.serialize())
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        clientSlug: user.clientSlug,
        role: user.role,
        onboardingComplete: user.onboardingComplete ?? false,
        mustChangePassword: user.mustChangePassword ?? false,
        botName: clientRow?.botName ?? null,
        botPersonality: clientRow?.botPersonality ?? null,
        botAvatarUrl: clientRow?.botAvatarUrl ?? null
      }
    })
  } catch (err) {
    console.error('[login]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

authRouter.post('/logout', async (req, res) => {
  try {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '')
    if (sessionId) {
      await lucia.invalidateSession(sessionId)
    }
    const sessionCookie = lucia.createBlankSessionCookie()
    res.setHeader('Set-Cookie', sessionCookie.serialize())
    res.json({ ok: true })
  } catch (err) {
    console.error('[logout]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

authRouter.get('/session', async (req, res) => {
  try {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '')
    if (!sessionId) {
      return res.status(401).json({ error: 'No session' })
    }

    const { session, user } = await lucia.validateSession(sessionId)
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' })
    }

    if (session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id)
      res.setHeader('Set-Cookie', sessionCookie.serialize())
    }

    // Look up bot persona from client workspace
    const [clientRow] = await db.select({
      botName: clients.botName,
      botPersonality: clients.botPersonality,
      botAvatarUrl: clients.botAvatarUrl
    }).from(clients).where(eq(clients.slug, user.clientSlug))

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        clientSlug: user.clientSlug,
        role: user.role,
        active: user.active,
        onboardingComplete: user.onboardingComplete ?? false,
        mustChangePassword: user.mustChangePassword ?? false,
        botName: clientRow?.botName ?? null,
        botPersonality: clientRow?.botPersonality ?? null,
        botAvatarUrl: clientRow?.botAvatarUrl ?? null
      }
    })
  } catch (err) {
    console.error('[session]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// --- Forgot Password ---

authRouter.post('/forgot-password', resetLimiter, async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Clean up expired/used tokens (lightweight, rate-limited to 3/hr)
    const now = Math.floor(Date.now() / 1000)
    await db.delete(passwordResetTokens).where(
      or(
        lt(passwordResetTokens.expiresAt, now),
        isNotNull(passwordResetTokens.usedAt)
      )
    )

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()))

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

      await db.insert(passwordResetTokens).values({
        id: crypto.randomUUID(),
        userId: user.id,
        tokenHash,
        expiresAt: now + 1800 // 30 minutes
      })

      const resetUrl = `${config.appUrl}/reset-password?token=${rawToken}`
      await sendPasswordResetEmail(user.email, resetUrl)
    } else {
      // Timing pad: run a bcrypt hash to match the timing of the user-found path
      await bcrypt.hash('timing-pad', 12)
    }

    // Always return the same response regardless of whether the email exists
    res.json({ ok: true })
  } catch (err) {
    console.error('[forgot-password]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// --- Reset Password ---

authRouter.post('/reset-password', resetLimiter, async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
      return res.status(400).json({ error: 'Invalid reset link' })
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return res.status(400).json({ error: passwordError })
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const now = Math.floor(Date.now() / 1000)

    const [tokenRow] = await db.select().from(passwordResetTokens).where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, now)
      )
    )

    if (!tokenRow) {
      return res.status(400).json({ error: 'Link expired or already used' })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await db.update(users).set({ passwordHash }).where(eq(users.id, tokenRow.userId))
    await db.update(passwordResetTokens).set({ usedAt: now }).where(eq(passwordResetTokens.id, tokenRow.id))
    await lucia.invalidateUserSessions(tokenRow.userId)

    res.json({ ok: true })
  } catch (err) {
    console.error('[reset-password]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// --- Change Password (authenticated) ---

authRouter.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required' })
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      return res.status(400).json({ error: passwordError })
    }

    const [dbUser] = await db.select().from(users).where(eq(users.id, req.user.id))
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await db.update(users).set({ passwordHash, mustChangePassword: false }).where(eq(users.id, req.user.id))

    // Invalidate all sessions, then create a fresh one so the user stays logged in
    await lucia.invalidateUserSessions(req.user.id)
    const session = await lucia.createSession(req.user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    res.setHeader('Set-Cookie', sessionCookie.serialize())

    res.json({ ok: true })
  } catch (err) {
    console.error('[change-password]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
