import { Router } from 'express'
import { readFile, writeFile, listFiles, moveFile, deleteFile } from '../lib/fileSystem.js'
import { requireAuth } from '../lib/auth.js'
import { join, basename, extname } from 'path'

export const assetsRouter = Router()

assetsRouter.use(requireAuth)

const VALID_FOLDERS = new Set(['drafts', 'published', 'campaigns', 'research', 'templates'])

function validateFolder(req, res) {
  const { folder } = req.params
  if (!VALID_FOLDERS.has(folder)) {
    res.status(400).json({ error: `Invalid folder. Must be one of: ${[...VALID_FOLDERS].join(', ')}` })
    return false
  }
  return true
}

// List files in a folder
assetsRouter.get('/:folder', (req, res) => {
  if (!validateFolder(req, res)) return
  const { clientSlug } = req.user
  const files = listFiles(clientSlug, req.params.folder)
  res.json(files)
})

// Get a single file
assetsRouter.get('/:folder/:filename', (req, res) => {
  if (!validateFolder(req, res)) return
  const { clientSlug } = req.user
  const { folder, filename } = req.params

  if (extname(filename) !== '.md') {
    return res.status(400).json({ error: 'Only .md files supported' })
  }

  const content = readFile(clientSlug, `${folder}/${filename}`)
  if (content === null) return res.status(404).json({ error: 'File not found' })

  const words = content.trim().split(/\s+/).filter(Boolean).length
  res.json({ content, filename, folder, wordCount: words })
})

// Create a file
assetsRouter.post('/:folder', (req, res) => {
  if (!validateFolder(req, res)) return
  const { clientSlug } = req.user
  const { folder } = req.params
  const { filename, content } = req.body

  if (!filename || extname(filename) !== '.md') {
    return res.status(400).json({ error: 'filename must end in .md' })
  }

  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string' })
  }

  try {
    writeFile(clientSlug, `${folder}/${basename(filename)}`, content)
    res.json({ ok: true, path: `${folder}/${basename(filename)}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update a file
assetsRouter.put('/:folder/:filename', (req, res) => {
  if (!validateFolder(req, res)) return
  const { clientSlug } = req.user
  const { folder, filename } = req.params
  const { content } = req.body

  if (extname(filename) !== '.md') {
    return res.status(400).json({ error: 'Only .md files supported' })
  }

  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string' })
  }

  try {
    writeFile(clientSlug, `${folder}/${basename(filename)}`, content)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete a file
assetsRouter.delete('/:folder/:filename', (req, res) => {
  if (!validateFolder(req, res)) return
  const { clientSlug } = req.user
  const { folder, filename } = req.params

  try {
    deleteFile(clientSlug, `${folder}/${filename}`)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Move a file to another folder
assetsRouter.post('/:folder/:filename/move', (req, res) => {
  if (!validateFolder(req, res)) return
  const { clientSlug } = req.user
  const { folder, filename } = req.params
  const { targetFolder } = req.body

  if (!VALID_FOLDERS.has(targetFolder)) {
    return res.status(400).json({ error: 'Invalid target folder' })
  }

  try {
    moveFile(clientSlug, `${folder}/${filename}`, `${targetFolder}/${filename}`)
    res.json({ ok: true, newPath: `${targetFolder}/${filename}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
