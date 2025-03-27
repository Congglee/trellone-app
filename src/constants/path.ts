const path = {
  boardDetails: '/boards/:boardId',
  login: '/login',
  oauth: '/login/oauth',
  register: '/register',
  accountVerification: '/account/verification',
  forgotPassword: '/forgot-password',
  forgotPasswordVerification: '/forgot-password/verification',
  resetPassword: '/reset-password'
} as const

export default path
