/**
 * One-time migration: backfill assets table from existing files on disk.
 * Scans drafts/ and published/ for each client, matches to conversations
 * via savedTo paths in messages JSON, and creates asset records.
 *
 * Run: node scripts/migrate-assets.js
 */

import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import { readdirSync, statSync, existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '..', 'db', 'maiar.db')
const db = new Database(dbPath)

// Get all clients
const clients = db.prepare('SELECT slug FROM clients').all()
const maiarRoot = join(__dirname, '..', '..')

let created = 0
let skipped = 0

for (const client of clients) {
  const clientDir = join(maiarRoot, 'clients', client.slug)

  for (const folder of ['drafts', 'published']) {
    const folderPath = join(clientDir, folder)
    if (!existsSync(folderPath)) continue

    const files = readdirSync(folderPath).filter(f => f.endsWith('.md'))

    for (const filename of files) {
      const filePath = `${folder}/${filename}`

      // Check if asset record already exists
      const existing = db.prepare('SELECT id FROM assets WHERE client_slug = ? AND file_path = ?')
        .get(client.slug, filePath)
      if (existing) {
        skipped++
        continue
      }

      // Search conversations for a savedTo matching this file
      const conversations = db.prepare(
        'SELECT id, messages FROM conversations WHERE client_slug = ?'
      ).all(client.slug)

      let conversationId = null
      for (const conv of conversations) {
        try {
          const msgs = JSON.parse(conv.messages || '[]')
          for (const msg of msgs) {
            if (msg.savedTo === filePath) {
              conversationId = conv.id
              break
            }
          }
        } catch { /* skip unparseable */ }
        if (conversationId) break
      }

      const stat = statSync(join(folderPath, filename))
      const title = filename.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-[a-f0-9]{8}$/, '').replace(/-/g, ' ')

      db.prepare(`
        INSERT INTO assets (id, client_slug, conversation_id, campaign_id, title, file_path, folder, status, created_at, updated_at)
        VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?)
      `).run(
        randomUUID(),
        client.slug,
        conversationId,
        title,
        filePath,
        folder,
        folder === 'published' ? 'published' : 'draft',
        Math.floor(stat.mtimeMs / 1000),
        Math.floor(stat.mtimeMs / 1000)
      )
      created++
    }
  }
}

console.log(`Created ${created} asset records, skipped ${skipped} existing`)
db.close()
