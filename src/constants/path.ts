const path = {
  boardDetails: '/boards/:boardId',
  login: '/login',
  oauth: '/login/oauth',
  register: '/register',
  accountVerification: '/account/verification',
  forgotPassword: '/forgot-password',
  forgotPasswordVerification: '/forgot-password/verification',
  resetPassword: '/reset-password',

  accountSettings: '/settings/account',
  securitySettings: '/settings/security'
} as const

export default path
