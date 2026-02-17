import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, renameSync, unlinkSync, existsSync } from 'fs'
import { join, extname, basename, dirname } from 'path'
import { config } from './config.js'

function clientRoot(clientSlug) {
  if (config.adminWorkspace && clientSlug === 'admin') {
    return config.adminWorkspace
  }
  return join(config.maiarRoot, 'clients', clientSlug)
}

function resolvePath(clientSlug, relativePath) {
  const root = clientRoot(clientSlug)
  const full = join(root, relativePath)
  // Security: prevent path traversal
  if (!full.startsWith(root)) {
    throw new Error('Invalid path')
  }
  return full
}

export function readFile(clientSlug, relativePath) {
  const full = resolvePath(clientSlug, relativePath)
  if (!existsSync(full)) return null
  return readFileSync(full, 'utf8')
}

export function writeFile(clientSlug, relativePath, content) {
  const full = resolvePath(clientSlug, relativePath)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content, 'utf8')
}

export function listFiles(clientSlug, folder) {
  const full = resolvePath(clientSlug, folder)
  if (!existsSync(full)) return []

  return readdirSync(full)
    .filter(f => extname(f) === '.md')
    .map(filename => {
      const filePath = join(full, filename)
      const stat = statSync(filePath)
      const content = readFileSync(filePath, 'utf8')
      const words = content.trim().split(/\s+/).filter(Boolean).length
      const preview = content.slice(0, 200).replace(/^#+\s.+\n/gm, '').trim().slice(0, 160)

      return {
        name: filename,
        slug: filename.replace('.md', ''),
        path: join(folder, filename),
        wordCount: words,
        lastModified: stat.mtime.toISOString(),
        preview
      }
    })
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
}

export function moveFile(clientSlug, fromPath, toPath) {
  const from = resolvePath(clientSlug, fromPath)
  const to = resolvePath(clientSlug, toPath)
  mkdirSync(dirname(to), { recursive: true })
  renameSync(from, to)
}

export function deleteFile(clientSlug, relativePath) {
  const full = resolvePath(clientSlug, relativePath)
  if (existsSync(full)) unlinkSync(full)
}

export function ensureClientDirs(clientSlug) {
  const folders = ['context/company', 'context/products', 'drafts', 'published', 'campaigns', 'research', 'templates']
  for (const folder of folders) {
    mkdirSync(resolvePath(clientSlug, folder), { recursive: true })
  }
}

