import { config } from '~/constants/config'

export const singleFileValidator = (file: File) => {
  if (file && (file.size >= config.maxSizeUploadAvatar || !file.type.includes('image'))) {
    // toast.error('Maximum file size is 3MB and file type must be an image.', { position: 'top-center' })
    return 'Maximum file size is 3MB and file type must be an image.'
  }
}
