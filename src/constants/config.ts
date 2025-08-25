const environment = import.meta.env.MODE || 'development'

export const envConfig = {
  baseUrl: environment === 'development' ? import.meta.env.VITE_APP_DEV_API_URL : import.meta.env.VITE_APP_PROD_API_URL,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleRedirectUri:
    environment === 'development'
      ? import.meta.env.VITE_GOOGLE_DEV_REDIRECT_URI
      : import.meta.env.VITE_GOOGLE_PROD_REDIRECT_URI
}

export const config = {
  maxSizeUploadAvatar: 3 * 1024 * 1024, // 3MB

  maxSizeUploadDocument: 10 * 1024 * 1024, // 10MB
  maxFileUploadDocument: 4, // 4 files
  maxSizeUploadDocumentTotal: 10 * 4 * 1024 * 1024, // 40MB
  allowedDocumentTypes: [
    'application/pdf', // .pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'text/plain', // .txt
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
  ],
  allowedImageMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
}
