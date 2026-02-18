import 'dotenv/config'
import Database from 'better-sqlite3'
import { resolve } from 'path'

const dbPath = resolve(new URL('.', import.meta.url).pathname, '..', 'db', 'maiar.db')
const db = new Database(dbPath)

const result = db.prepare("UPDATE users SET role = 'super_admin' WHERE role = 'admin'").run()
console.log(`Migrated ${result.changes} admin user(s) to super_admin`)

db.close()
