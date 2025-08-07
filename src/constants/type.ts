export const TokenType = {
  AccessToken: 0,
  RefreshToken: 1,
  ForgotPasswordToken: 2,
  EmailVerifyToken: 3,
  InviteToken: 4
} as const

export const WorkspaceType = {
  Public: 'Public',
  Private: 'Private'
} as const

export const WorkspaceTypeValues = [WorkspaceType.Public, WorkspaceType.Private] as const

export const WorkspaceRole = {
  Admin: 'Admin',
  Normal: 'Normal'
} as const

export const WorkspaceRoleValues = [WorkspaceRole.Admin, WorkspaceRole.Normal] as const

export const BoardRole = {
  Admin: 'Admin',
  Member: 'Member',
  Observer: 'Observer'
} as const

export const BoardRoleValues = [BoardRole.Admin, BoardRole.Member, BoardRole.Observer] as const

export const BoardType = {
  Public: 'Public',
  Private: 'Private'
} as const

export const BoardTypeValues = [BoardType.Public, BoardType.Private] as const

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

export const CardCommentReactionAction = {
  Add: 'ADD',
  Remove: 'REMOVE'
} as const

export const CardCommentReactionActionValues = [
  CardCommentReactionAction.Add,
  CardCommentReactionAction.Remove
] as const

export const RoleLevel = {
  Workspace: 'Workspace',
  Board: 'Board'
}

export const RoleLevelValues = [RoleLevel.Workspace, RoleLevel.Board] as const
