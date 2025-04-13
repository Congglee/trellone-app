import { UserType } from '~/schemas/user.schema'

export interface CommonQueryParams {
  page?: number
  limit?: number
}

export interface AuthQueryParams {
  registered_email?: string
  verified_email?: string
  forgot_password_token?: string
  token?: string
  email?: string
}

export interface OAuthQueryParams {
  access_token?: string
  refresh_token?: string
  new_user?: number
  verify?: UserType['verify']
}

export interface BoardInvitationQueryParams {
  token?: string
  board_id?: string
}
