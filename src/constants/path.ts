const path = {
  // Front Landing Page
  frontPage: '/',

  // Workspace Pages
  home: '/home',
  boardsList: '/boards',
  workspaceHome: '/workspaces/:workspaceId/home',
  workspaceBoards: '/workspaces/:workspaceId/boards',
  workspaceHighlights: '/workspaces/:workspaceId/highlights',
  workspaceMembers: '/workspaces/:workspaceId/members',
  workspaceGuests: '/workspaces/:workspaceId/members/guests',
  workspaceSettings: '/workspaces/:workspaceId/settings',

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
  boardInvitationVerification: '/board-invitation/verification',
  workspaceInvitationVerification: '/workspace-invitation/verification',

  // Access Control
  accessDenied: '/access-denied'
} as const

export default path
