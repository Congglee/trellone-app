import { TokenType, UserVerifyStatus } from '~/constants/type'

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]

export type UserVerifyStatusType = (typeof UserVerifyStatus)[keyof typeof UserVerifyStatus]

export interface TokenPayload {
  user_id: string
  token_type: TokenTypeValue
  verify: UserVerifyStatusType
  exp: number
  iat: number
}

export interface InviteTokenPayload extends TokenPayload {
  inviter_id: string
  invitation_id: string
}
