export const TokenType = {
  AccessToken: 0,
  RefreshToken: 1,
  ForgotPasswordToken: 2,
  EmailVerifyToken: 3,
  InviteToken: 4
} as const

export const BoardType = {
  Public: 'public',
  Private: 'private'
} as const

export const BoardTypeValues = [BoardType.Public, BoardType.Private] as const

export const Role = {
  Client: 'client',
  Admin: 'admin'
} as const

export const RoleValues = [Role.Client, Role.Admin] as const

export const UserVerifyStatus = {
  Unverified: 0,
  Verified: 1,
  Banned: 2
} as const

export const UserVerifyStatusValues = [
  UserVerifyStatus.Unverified,
  UserVerifyStatus.Verified,
  UserVerifyStatus.Banned
] as const

export const MediaType = {
  Image: 0,
  Document: 1
} as const

export const MediaTypeValues = [MediaType.Image, MediaType.Document] as const

export const CardMemberAction = {
  Add: 'ADD',
  Remove: 'REMOVE'
} as const

export const CardMemberActionValues = [CardMemberAction.Add, CardMemberAction.Remove] as const

export const InvitationType = {
  BoardInvitation: 'BOARD_INVITATION'
}

export const InvitationTypeValues = [InvitationType.BoardInvitation] as const

export const BoardInvitationStatus = {
  Pending: 'PENDING',
  Accepted: 'ACCEPTED',
  Rejected: 'REJECTED'
}

export const BoardInvitationStatusValues = [
  BoardInvitationStatus.Pending,
  BoardInvitationStatus.Accepted,
  BoardInvitationStatus.Rejected
] as const

export const AttachmentType = {
  File: 'FILE',
  Link: 'LINK'
} as const

export const AttachmentTypeValues = [AttachmentType.Link, AttachmentType.File] as const

export const CardAttachmentAction = {
  Add: 'ADD',
  Edit: 'EDIT',
  Remove: 'REMOVE'
} as const

export const CardAttachmentActionValues = [
  CardAttachmentAction.Add,
  CardAttachmentAction.Edit,
  CardAttachmentAction.Remove
] as const

export const CommentAction = {
  Add: 'ADD',
  Edit: 'EDIT',
  Remove: 'REMOVE'
} as const

export const CommentActionValues = [CommentAction.Add, CommentAction.Edit, CommentAction.Remove] as const
