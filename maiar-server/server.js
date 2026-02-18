import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { authRouter } from './routes/auth.js'
import { chatRouter } from './routes/chat.js'
import { contextRouter } from './routes/context.js'
import { assetsRouter } from './routes/assets.js'
import { adminRouter } from './routes/admin.js'
import { onboardingRouter } from './routes/onboarding.js'
import { profileRouter } from './routes/profile.js'
import { campaignRouter } from './routes/campaigns.js'
import { assetsDbRouter } from './routes/assets-db.js'
import { requireAuth } from './lib/auth.js'
import { config } from './lib/config.js'
import { verifyTransport } from './lib/email.js'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  }
}))
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? false
    : ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}))
app.use(express.json({ limit: '20mb' }))
app.use(cookieParser())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/chat', chatRouter)
app.use('/api/context', contextRouter)
app.use('/api/assets', assetsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/onboarding', onboardingRouter)
app.use('/api/profile', profileRouter)
app.use('/api/campaigns', campaignRouter)
app.use('/api/asset-records', assetsDbRouter)

// Serve avatar uploads
const avatarsPath = join(__dirname, 'ui', 'static', 'avatars')
app.use('/avatars', express.static(avatarsPath))

// System status (protected)
app.get('/api/system/status', requireAuth, (req, res) => {
  res.json({
    ok: true,
    maiarRoot: config.maiarRoot,
    model: config.model,
    user: {
      email: req.user.email,
      role: req.user.role,
      clientSlug: req.user.clientSlug
    }
  })
})

// Global error handler — prevents leaking stack traces
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// Serve SvelteKit build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, 'ui', 'dist')
  if (existsSync(distPath)) {
    app.use(express.static(distPath))
    app.get('*', (req, res) => {
      res.sendFile(join(distPath, 'index.html'))
    })
  }
}

app.listen(config.port, () => {
  console.log(`Maiar server running on http://localhost:${config.port}`)
  console.log(`Maiar root: ${config.maiarRoot}`)
  console.log(`Maiar master: ${config.maiarMaster}`)
  console.log(`Model: ${config.model}`)
  console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`)

  // Verify SMTP — logs a warning if misconfigured, does not block startup
  verifyTransport().catch(err => {
    console.warn('[EMAIL] SMTP not configured or unreachable:', err.message)
    console.warn('[EMAIL] Password reset emails will not be sent until SMTP is configured.')
  })
})
