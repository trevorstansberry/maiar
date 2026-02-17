/**
 * Create the initial admin user.
 * Run once: node scripts/seed-admin.js
 *
 * Edit EMAIL and PASSWORD before running.
 */
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { db } from '../lib/db.js'
import { users } from '../db/schema.js'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { sqlite } from '../lib/db.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

// ── EDIT THESE ──────────────────────────────────────────────
const EMAIL = 'admin@yourmaiar.com'
const PASSWORD = 'change-me-immediately'
const CLIENT_SLUG = 'admin'
// ────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))

// Run migrations first
try {
  migrate(db, { migrationsFolder: join(__dirname, '../db/migrations') })
  console.log('Migrations applied.')
} catch (err) {
  // If using drizzle-kit push, migrations folder may not exist — that's ok
  console.log('Skipping migrations (run drizzle-kit push instead).')
}

const passwordHash = await bcrypt.hash(PASSWORD, 12)
const id = randomUUID()

try {
  await db.insert(users).values({
    id,
    email: EMAIL.toLowerCase(),
    passwordHash,
    clientSlug: CLIENT_SLUG,
    role: 'admin',
    active: true
  })
  console.log(`✓ Admin user created: ${EMAIL}`)
  console.log(`  ID: ${id}`)
  console.log(`  Client slug: ${CLIENT_SLUG}`)
  console.log('\n⚠  Change the password before going live.')
} catch (err) {
  if (err.message?.includes('UNIQUE')) {
    console.log(`Admin user already exists: ${EMAIL}`)
  } else {
    console.error('Error creating admin:', err)
    process.exit(1)
  }
}

process.exit(0)
