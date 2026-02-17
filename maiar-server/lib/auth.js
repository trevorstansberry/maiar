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
      onboardingComplete: attributes.onboardingComplete ?? false
    }
  }
})

/**
 * Express middleware — validates session cookie, attaches user to req.
 * Returns 401 if no valid session.
 */
export async function requireAuth(req, res, next) {
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
}

/**
 * Express middleware — requires admin role. Must be used after requireAuth.
 */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}
