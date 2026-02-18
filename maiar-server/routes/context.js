import { Router } from 'express'
import { readFile, writeFile, listFiles, ensureClientDirs } from '../lib/fileSystem.js'
import { getContextFileList, getProducts } from '../lib/contextLoader.js'
import { requireAuth } from '../lib/auth.js'
import { join } from 'path'
import { existsSync, mkdirSync, readdirSync, cpSync } from 'fs'
import { config } from '../lib/config.js'

export const contextRouter = Router()

contextRouter.use(requireAuth)

// List all context files with fill status
contextRouter.get('/', (req, res) => {
  const { clientSlug } = req.user
  try {
    const fileList = getContextFileList(clientSlug)
    res.json(fileList)
  } catch (err) {
    console.error('[context] list error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Quick health check — are core context files populated?
contextRouter.get('/status', (req, res) => {
  const { clientSlug } = req.user
  try {
    const files = getContextFileList(clientSlug)
    const essentials = [
      files.company.find(f => f.filename === 'brand-voice.md'),
      ...files.products.filter(f => f.filename === 'overview.md')
    ]
    const ready = essentials.some(f => f?.fillStatus === 'filled')
    res.json({ ready })
  } catch {
    res.json({ ready: false })
  }
})

// Get product list
contextRouter.get('/products', (req, res) => {
  const { clientSlug } = req.user
  try {
    res.json(getProducts(clientSlug))
  } catch (err) {
    console.error('[context] products error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create a new product folder from _template
contextRouter.post('/products', (req, res) => {
  const { clientSlug } = req.user
  const { slug, displayName } = req.body

  if (!slug || !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug — use 1-63 lowercase letters, numbers, or hyphens (no leading/trailing hyphens)' })
  }

  const productDir = join(config.maiarRoot, 'clients', clientSlug, 'context', 'products', slug)
  if (existsSync(productDir)) {
    return res.status(409).json({ error: 'Product already exists' })
  }

  // Copy from master _template
  const templateDir = join(config.maiarMaster, 'context', 'products', '_template')
  if (existsSync(templateDir)) {
    cpSync(templateDir, productDir, { recursive: true })
  } else {
    mkdirSync(productDir, { recursive: true })
  }

  // Update products.md to add this product
  let productsFile = readFile(clientSlug, 'context/products.md') ?? '# Products\n\n'
  if (!productsFile.includes(slug)) {
    productsFile += `- \`${slug}\` — ${displayName ?? slug}\n`
    writeFile(clientSlug, 'context/products.md', productsFile)
  }

  res.json({ ok: true, slug })
})

// Read a specific context file
// section = 'company' or 'products/[slug]'
const VALID_SECTIONS = /^(company|products\/[a-z0-9][a-z0-9-]{0,61}[a-z0-9]?)$/

contextRouter.get('/:section/:filename', (req, res) => {
  const { clientSlug } = req.user
  const { section, filename } = req.params

  if (!VALID_SECTIONS.test(section)) {
    return res.status(400).json({ error: 'Invalid section' })
  }

  if (!filename.endsWith('.md')) {
    return res.status(400).json({ error: 'Only .md files supported' })
  }

  const relativePath = `context/${section}/${filename}`
  const content = readFile(clientSlug, relativePath)

  if (content === null) {
    return res.status(404).json({ error: 'File not found' })
  }

  res.json({ content, path: relativePath })
})

// Write a context file
contextRouter.put('/:section/:filename', (req, res) => {
  const { clientSlug } = req.user
  const { section, filename } = req.params
  const { content } = req.body

  if (!VALID_SECTIONS.test(section)) {
    return res.status(400).json({ error: 'Invalid section' })
  }

  if (!filename.endsWith('.md')) {
    return res.status(400).json({ error: 'Only .md files supported' })
  }

  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string' })
  }

  try {
    writeFile(clientSlug, `context/${section}/${filename}`, content)
    res.json({ ok: true })
  } catch (err) {
    console.error('[context] write error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
