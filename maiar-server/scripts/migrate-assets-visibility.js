/**
 * Migration: Add userId and visibility columns to assets table.
 * Run once: node scripts/migrate-assets-visibility.js
 */
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '..', 'db', 'maiar.db')
const sqlite = new Database(dbPath)

console.log('[migrate] Opening database at', dbPath)

// Check if columns already exist
const cols = sqlite.pragma('table_info(assets)').map(c => c.name)

if (!cols.includes('user_id')) {
  sqlite.exec(`ALTER TABLE assets ADD COLUMN user_id TEXT`)
  console.log('[migrate] Added user_id column')
} else {
  console.log('[migrate] user_id column already exists, skipping')
}

if (!cols.includes('visibility')) {
  sqlite.exec(`ALTER TABLE assets ADD COLUMN visibility TEXT NOT NULL DEFAULT 'private'`)
  console.log('[migrate] Added visibility column')
} else {
  console.log('[migrate] visibility column already exists, skipping')
}

// Backfill: published assets should be org-visible
const result = sqlite.prepare(`UPDATE assets SET visibility = 'org' WHERE folder = 'published' AND visibility = 'private'`).run()
console.log(`[migrate] Backfilled ${result.changes} published assets to visibility='org'`)

sqlite.close()
console.log('[migrate] Done')
