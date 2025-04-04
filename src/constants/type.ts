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
  Image: 0
} as const

export const MediaTypeValues = [MediaType.Image, 1] as const

export const CardMemberAction = {
  Add: 'ADD',
  Remove: 'REMOVE'
} as const

export const CardMemberActionValues = [CardMemberAction.Add, CardMemberAction.Remove] as const
