import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'
import { config } from './config.js'
import { readFile } from './fileSystem.js'

const FILL_MIN_PARTIAL = 50
const FILL_MIN_FILLED = 200

/**
 * Load all context for a client into a single string for the system prompt.
 * Reads: context/company/* + context/products/[active-product]/*
 */
export function loadContext(clientSlug) {
  const parts = []

  // Company context
  const companyDir = join(config.maiarRoot, 'clients', clientSlug, 'context', 'company')
  if (existsSync(companyDir)) {
    const files = readdirSync(companyDir).filter(f => f.endsWith('.md')).sort()
    for (const file of files) {
      const content = readFileSync(join(companyDir, file), 'utf8').trim()
      if (content) parts.push(`## Company Context: ${file}\n\n${content}`)
    }
  }

  // Active product context
  const activeSlug = getActiveProduct(clientSlug)
  if (activeSlug) {
    const productDir = join(config.maiarRoot, 'clients', clientSlug, 'context', 'products', activeSlug)
    if (existsSync(productDir)) {
      const files = readdirSync(productDir).filter(f => f.endsWith('.md')).sort()
      for (const file of files) {
        const content = readFileSync(join(productDir, file), 'utf8').trim()
        if (content) parts.push(`## Product Context (${activeSlug}): ${file}\n\n${content}`)
      }
    }
  }

  return parts.join('\n\n---\n\n')
}

/**
 * Parse context/products.md to get product list and default.
 */
export function getProducts(clientSlug) {
  const content = readFile(clientSlug, 'context/products.md')
  if (!content) return { products: [], default: null }

  const products = []
  let defaultSlug = null

  const lines = content.split('\n')
  for (const line of lines) {
    const match = line.match(/^[-*]\s+`?([a-z0-9-]+)`?\s*(\(default\))?/i)
    if (match) {
      const slug = match[1]
      const isDefault = !!match[2]
      products.push({ slug, isDefault })
      if (isDefault) defaultSlug = slug
    }
  }

  if (!defaultSlug && products.length > 0) {
    defaultSlug = products[0].slug
  }

  return { products, default: defaultSlug }
}

export function getActiveProduct(clientSlug) {
  return getProducts(clientSlug).default
}

/**
 * Returns fill status for all context files — used in onboarding + context library.
 */
export function getContextFileList(clientSlug) {
  const result = { company: [], products: [] }

  const companyDir = join(config.maiarRoot, 'clients', clientSlug, 'context', 'company')
  if (existsSync(companyDir)) {
    for (const file of readdirSync(companyDir).filter(f => f.endsWith('.md'))) {
      const content = readFileSync(join(companyDir, file), 'utf8')
      result.company.push({
        filename: file,
        section: 'company',
        displayName: fileToDisplayName(file),
        fillStatus: getFillStatus(content),
        lastModified: statSync(join(companyDir, file)).mtime.toISOString()
      })
    }
  }

  const { products } = getProducts(clientSlug)
  for (const product of products) {
    const productDir = join(config.maiarRoot, 'clients', clientSlug, 'context', 'products', product.slug)
    if (existsSync(productDir)) {
      for (const file of readdirSync(productDir).filter(f => f.endsWith('.md'))) {
        const content = readFileSync(join(productDir, file), 'utf8')
        result.products.push({
          filename: file,
          section: `products/${product.slug}`,
          productSlug: product.slug,
          displayName: fileToDisplayName(file),
          fillStatus: getFillStatus(content),
          lastModified: statSync(join(productDir, file)).mtime.toISOString()
        })
      }
    }
  }

  return result
}

function getFillStatus(content) {
  // Strip markdown headings and HTML comments (template scaffolding)
  const stripped = content
    .replace(/^#+\s.+$/gm, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[.*?\]/g, '')
    .trim()
  const len = stripped.length
  if (len >= FILL_MIN_FILLED) return 'filled'
  if (len >= FILL_MIN_PARTIAL) return 'partial'
  return 'empty'
}

function fileToDisplayName(filename) {
  return filename
    .replace('.md', '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
