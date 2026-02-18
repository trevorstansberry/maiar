/**
 * Migration: backfill clients table from distinct clientSlug values in users.
 * Run once: node scripts/migrate-clients.js
 */
import 'dotenv/config'
import { randomUUID } from 'crypto'
import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '..', 'db', 'maiar.db')
const db = new Database(dbPath)

// Get distinct client slugs
const slugs = db.prepare('SELECT DISTINCT client_slug FROM users').all()

console.log(`Found ${slugs.length} distinct client slugs:`, slugs.map(r => r.client_slug))

const insert = db.prepare('INSERT OR IGNORE INTO clients (id, slug, display_name, active, created_at) VALUES (?, ?, ?, 1, ?)')

for (const { client_slug } of slugs) {
  // Generate a display name from slug: "arcane-academy" → "Arcane Academy"
  const displayName = client_slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const id = randomUUID()
  const now = Math.floor(Date.now() / 1000)

  insert.run(id, client_slug, displayName, now)
  console.log(`  Created client: ${client_slug} → ${displayName} (${id})`)
}

console.log('Done.')
db.close()
