import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const config = {
  port: parseInt(process.env.PORT ?? '3000'),
  maiarRoot: resolve(process.env.MAIAR_ROOT ?? `${__dirname}/..`),
  maiarMaster: resolve(process.env.MAIAR_MASTER ?? `${__dirname}/../../`),
  // Optional: point a specific client slug's workspace directly to a path on disk.
  // Used to share the admin workspace with Claude Code (both read/write the same files).
  // Format: ADMIN_WORKSPACE=/path/to/Maiar
  adminWorkspace: process.env.ADMIN_WORKSPACE ? resolve(process.env.ADMIN_WORKSPACE) : null,
  model: 'claude-sonnet-4-5-20250929',
  maxTokens: 8192,
  sessionExpiry: 60 * 60 * 24 * 7, // 7 days in seconds
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  emailFrom: process.env.EMAIL_FROM ?? 'Maiar <noreply@maiar.work>',
  appUrl: process.env.APP_URL ?? 'http://localhost:5173'
}

export const CONTENT_COMMANDS = new Set([
  '/write', '/email', '/social', '/ads', '/research',
  '/campaign', '/repurpose', '/persona', '/competitor'
])
