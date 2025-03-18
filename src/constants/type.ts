export const BoardType = {
  Public: 'public',
  Private: 'private'
} as const

export const BoardTypeValues = [BoardType.Public, BoardType.Private] as const
