/**
 * One-time migration: backfill client_slug on conversations table
 * from the user's client_slug via userId join.
 *
 * Run: node scripts/migrate-conversation-client-slug.js
 */

import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '..', 'db', 'maiar.db')
const db = new Database(dbPath)

const result = db.prepare(`
  UPDATE conversations
  SET client_slug = (
    SELECT client_slug FROM users WHERE users.id = conversations.user_id
  )
  WHERE client_slug IS NULL
`).run()

console.log(`Updated ${result.changes} conversations with client_slug`)
db.close()
