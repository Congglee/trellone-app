import { UserType } from '~/schemas/user.schema'

export interface CommonQueryParams {
  page?: number | string
  limit?: number | string
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

export interface WorkspaceInvitationQueryParams {
  token?: string
  workspace_id?: string
}

export interface BoardInvitationQueryParams {
  token?: string
  board_id?: string
}

export interface BoardQueryParams extends CommonQueryParams {
  keyword?: string
  state?: 'closed' | 'active'
  workspace?: string
}
