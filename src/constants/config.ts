const environment = import.meta.env.MODE || 'development'

export const envConfig = {
  baseUrl: environment === 'development' ? import.meta.env.VITE_APP_DEV_API_URL : import.meta.env.VITE_APP_PROD_API_URL,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleRedirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI
}

export const config = {
  maxSizeUploadAvatar: 3 * 1024 * 1024 // 3MB
}
