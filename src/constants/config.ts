export const envConfig = {
  baseUrl: import.meta.env.VITE_APP_API_URL,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleRedirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI
}

export const config = {
  maxSizeUploadAvatar: 3 * 1024 * 1024 // 3MB
}
