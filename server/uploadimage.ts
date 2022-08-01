import formidable from 'formidable'
import { mkdirSync } from 'fs'

export let uploadDir = 'src/upload'

mkdirSync(uploadDir, { recursive: true })

let counter = 0

export let form = new formidable.IncomingForm({
  uploadDir,
  multiples: true,
  allowEmptyFiles: false,
  maxFiles: 4,
  maxFileSize: 200 * 1024 ** 2,
  keepExtensions: true,
  filter: part => part.mimetype?.startsWith('image/') || false,
  filename: (originalName, originalExt, part, form) => {
    counter++
    let fieldName = part.name
    let timestamp = Date.now()
    let ext = part.mimetype?.split('/').pop()
    return `${fieldName}-${timestamp}-${counter}.${ext}`
  }
})

export function extractSingleFile(
  file: formidable.File[] | formidable.File,
): formidable.File | undefined {
    // console.log("FILES IN FUNCTION:",file)
  return Array.isArray(file) ? file[0] : file
}
