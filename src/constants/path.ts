const path = {
  home: '/',
  boardsList: '/boards',
  boardDetails: '/boards/:boardId',
  login: '/login',
  oauth: '/login/oauth',
  register: '/register',
  accountVerification: '/account/verification',
  forgotPassword: '/forgot-password',
  forgotPasswordVerification: '/forgot-password/verification',
  resetPassword: '/reset-password',

  accountSettings: '/settings/account',
  securitySettings: '/settings/security',

  boardInvitationVerification: '/board-invitation/verification'
} as const

export default path
