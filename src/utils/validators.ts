import { config } from '~/constants/config'

export const singleFileValidator = (file: File) => {
  if (file && (file.size >= config.maxSizeUploadAvatar || !file.type.includes('image'))) {
    return 'Maximum file size is 3MB and file type must be an image.'
  }

  return null
}
