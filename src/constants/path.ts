const path = {
  // Front Landing Page
  frontPage: '/',

  // Workspace Pages
  home: '/home',
  boardsList: '/boards',

  // Board Details Page
  boardDetails: '/boards/:boardId',

  // Auth Pages
  login: '/login',
  oauth: '/login/oauth',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // Settings Pages
  accountSettings: '/settings/account',
  securitySettings: '/settings/security',

  // Verification Pages
  accountVerification: '/account/verification',
  forgotPasswordVerification: '/forgot-password/verification',
  boardInvitationVerification: '/board-invitation/verification'
} as const

export default path
