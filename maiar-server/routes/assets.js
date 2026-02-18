import { Router } from 'express'
import { readFile, writeFile, listFiles, moveFile, deleteFile } from '../lib/fileSystem.js'
import { requireAuth } from '../lib/auth.js'
import { join, basename, extname } from 'path'
import { db } from '../lib/db.js'
import { assets } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

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
    console.error('[assets] create error:', err)
    res.status(500).json({ error: 'Internal server error' })
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
    console.error('[assets] update error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete a file
assetsRouter.delete('/:folder/:filename', async (req, res) => {
  if (!validateFolder(req, res)) return
  const { clientSlug } = req.user
  const { folder, filename } = req.params

  try {
    deleteFile(clientSlug, `${folder}/${filename}`)
    // Sync: remove matching asset record
    try {
      await db.delete(assets)
        .where(and(eq(assets.clientSlug, clientSlug), eq(assets.filePath, `${folder}/${filename}`)))
    } catch (dbErr) {
      console.error('[assets] DB sync delete failed:', dbErr)
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('[assets] delete error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Rename a file (same folder, new name)
assetsRouter.post('/:folder/:filename/rename', async (req, res) => {
  if (!validateFolder(req, res)) return
  const { clientSlug } = req.user
  const { folder, filename } = req.params
  const { newFilename } = req.body

  if (!newFilename || extname(basename(newFilename)) !== '.md') {
    return res.status(400).json({ error: 'newFilename must end in .md' })
  }

  const safeName = basename(newFilename)

  try {
    moveFile(clientSlug, `${folder}/${filename}`, `${folder}/${safeName}`)
    // Sync: update asset record filePath
    try {
      await db.update(assets)
        .set({ filePath: `${folder}/${safeName}`, updatedAt: new Date() })
        .where(and(eq(assets.clientSlug, clientSlug), eq(assets.filePath, `${folder}/${filename}`)))
    } catch (dbErr) {
      console.error('[assets] DB sync rename failed:', dbErr)
    }
    res.json({ ok: true, newPath: `${folder}/${safeName}` })
  } catch (err) {
    console.error('[assets] rename error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Move a file to another folder
assetsRouter.post('/:folder/:filename/move', async (req, res) => {
  if (!validateFolder(req, res)) return
  const { clientSlug } = req.user
  const { folder, filename } = req.params
  const { targetFolder } = req.body

  if (!VALID_FOLDERS.has(targetFolder)) {
    return res.status(400).json({ error: 'Invalid target folder' })
  }

  try {
    moveFile(clientSlug, `${folder}/${filename}`, `${targetFolder}/${filename}`)
    // Sync: update asset record folder, filePath, and status
    try {
      await db.update(assets)
        .set({
          folder: targetFolder,
          filePath: `${targetFolder}/${filename}`,
          status: targetFolder === 'published' ? 'published' : 'draft',
          visibility: targetFolder === 'published' ? 'org' : 'private',
          updatedAt: new Date()
        })
        .where(and(eq(assets.clientSlug, clientSlug), eq(assets.filePath, `${folder}/${filename}`)))
    } catch (dbErr) {
      console.error('[assets] DB sync move failed:', dbErr)
    }
    res.json({ ok: true, newPath: `${targetFolder}/${filename}` })
  } catch (err) {
    console.error('[assets] move error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
