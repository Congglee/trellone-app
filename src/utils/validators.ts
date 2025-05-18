import { config } from '~/constants/config'

export const singleFileValidator = (file: File) => {
  if (file && (file.size >= config.maxSizeUploadAvatar || !file.type.includes('image'))) {
    return 'Maximum file size is 3MB and file type must be an image.'
  }

  return null
}

export const multipleDocumentFilesValidator = (files: FileList) => {
  if (!files || files.length === 0) {
    return null
  }

  // Check maximum number of files
  if (files.length > config.maxFileUploadDocument) {
    return `You can upload a maximum of ${config.maxFileUploadDocument} files.`
  }

  let totalSize = 0

  for (const file of files) {
    // Check individual file size
    if (file.size > config.maxSizeUploadDocument) {
      return `File "${file.name}" exceeds the maximum size of ${config.maxSizeUploadDocument / (1024 * 1024)}MB.`
    }

    const allowedMimeTypes = [...config.allowedDocumentTypes, ...config.allowedImageMimeTypes]

    // Check file type
    if (!allowedMimeTypes.includes(file.type)) {
      return `File type of "${file.name}" is not allowed. Allowed types are: ${allowedMimeTypes.join(', ')}.`
    }

    totalSize += file.size
  }

  // Check total upload size
  if (totalSize > config.maxSizeUploadDocumentTotal) {
    return `Total upload size exceeds the maximum of ${config.maxSizeUploadDocumentTotal / (1024 * 1024)}MB.`
  }

  return null
}
