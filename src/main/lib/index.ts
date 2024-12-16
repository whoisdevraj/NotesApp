import { ensureDir, readFile, writeFile, remove } from 'fs-extra'
import { readdir, stat } from 'fs/promises'
import { appDirectoryName, fileEncoding, welcomeNoteFilename } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import path from 'path'
import { homedir } from 'os'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = (): string => {
  return path.join(homedir(), appDirectoryName)
}

// Get the list of notes from the directory
export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  try {
    // Ensure the directory exists
    await ensureDir(rootDir)

    // Read all files in the directory
    const notesFileNames = await readdir(rootDir, { encoding: fileEncoding, withFileTypes: false })

    // Filter out only markdown files
    const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

    // If no notes found, create a welcome note
    if (notes.length === 0) {
      console.info('No notes found, creating a welcome note')
      const content = await readFile(welcomeNoteFile, { encoding: fileEncoding })

      // Create the welcome note
      await writeFile(path.join(rootDir, welcomeNoteFilename), content, { encoding: fileEncoding })
      notes.push(welcomeNoteFilename)
    }

    return Promise.all(notes.map(getNoteInfoFromFilename))
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

// Helper function to get note info from the filename
export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  try {
    const fileStats = await stat(path.join(getRootDir(), filename))
    return {
      title: filename.replace(/\.md$/, ''),
      lastEditedTime: fileStats.mtimeMs
    }
  } catch (error) {
    console.error('Error getting note info:', error)
    throw error
  }
}

// Read a specific note
export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()

  try {
    return await readFile(path.join(rootDir, `${filename}.md`), { encoding: fileEncoding })
  } catch (error) {
    console.error('Error reading note:', error)
    throw error
  }
}

// Write content to a note
export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir()

  try {
    console.info(`Writing note ${filename}`)
    return await writeFile(path.join(rootDir, `${filename}.md`), content, {
      encoding: fileEncoding
    })
  } catch (error) {
    console.error('Error writing note:', error)
    throw error
  }
}

// Create a new note
export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()

  try {
    await ensureDir(rootDir)

    const { filePath, canceled } = await dialog.showSaveDialog({
      title: 'New note',
      defaultPath: path.join(rootDir, 'Untitled.md'),
      buttonLabel: 'Create',
      properties: ['showOverwriteConfirmation'],
      showsTagField: false,
      filters: [{ name: 'Markdown', extensions: ['md'] }]
    })

    if (canceled || !filePath) {
      console.info('Note creation canceled')
      return false
    }

    const { name: filename, dir: parentDir } = path.parse(filePath)

    if (parentDir !== rootDir) {
      await dialog.showMessageBox({
        type: 'error',
        title: 'Creation failed',
        message: `All notes must be saved under ${rootDir}. Avoid using other directories!`
      })

      return false
    }

    console.info(`Creating note: ${filePath}`)
    await writeFile(filePath, '') // Create an empty file

    return filename
  } catch (error) {
    console.error('Error creating note:', error)
    throw error
  }
}

// Delete a note
export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir()

  try {
    const { response } = await dialog.showMessageBox({
      type: 'warning',
      title: 'Delete note',
      message: `Are you sure you want to delete ${filename}?`,
      buttons: ['Delete', 'Cancel'],
      defaultId: 1,
      cancelId: 1
    })

    if (response === 1) {
      console.info('Note deletion canceled')
      return false
    }

    console.info(`Deleting note: ${filename}`)
    await remove(path.join(rootDir, `${filename}.md`))
    return true
  } catch (error) {
    console.error('Error deleting note:', error)
    throw error
  }
}
