export const envConfig = {
  baseUrl: import.meta.env.VITE_APP_API_URL,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleRedirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  appUrl: import.meta.env.VITE_APP_URL
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
