import { Lucia } from 'lucia'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { db, sqlite } from './db.js'
import { sessions, users } from '../db/schema.js'

const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
  },
  getUserAttributes(attributes) {
    return {
      email: attributes.email,
      clientSlug: attributes.clientSlug,
      role: attributes.role,
      active: attributes.active,
      onboardingComplete: attributes.onboardingComplete ?? false,
      name: attributes.name ?? null,
      mustChangePassword: attributes.mustChangePassword ?? false
    }
  }
})

/**
 * Express middleware — validates session cookie, attaches user to req.
 * Returns 401 if no valid session.
 */
export async function requireAuth(req, res, next) {
  try {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '')

    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { session, user } = await lucia.validateSession(sessionId)

    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      res.setHeader('Set-Cookie', sessionCookie.serialize())
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id)
      res.setHeader('Set-Cookie', sessionCookie.serialize())
    }

    if (!user.active) {
      return res.status(403).json({ error: 'Account disabled' })
    }

    req.user = user
    req.session = session
    next()
  } catch (err) {
    console.error('[requireAuth]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Express middleware — requires super_admin role. Must be used after requireAuth.
 */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}

/**
 * Express middleware — requires client_admin or super_admin. Must be used after requireAuth.
 */
export function requireClientAdmin(req, res, next) {
  if (req.user?.role !== 'client_admin' && req.user?.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}
