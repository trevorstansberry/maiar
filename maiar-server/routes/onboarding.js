import { Router } from 'express'
import { requireAuth } from '../lib/auth.js'
import { db } from '../lib/db.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export const onboardingRouter = Router()

onboardingRouter.use(requireAuth)

// Mark onboarding complete for the current user
onboardingRouter.post('/complete', async (req, res) => {
  try {
    await db
      .update(users)
      .set({ onboardingComplete: true })
      .where(eq(users.id, req.user.id))

    res.json({ ok: true })
  } catch (err) {
    console.error('[onboarding] complete error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
