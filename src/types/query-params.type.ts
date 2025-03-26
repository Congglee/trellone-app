export interface CommonQueryParams {
  page?: number
  limit?: number
}

export interface AuthQueryParams {
  registered_email?: string
  verified_email?: string
  token?: string
  email?: string
}
