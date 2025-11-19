import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import axios, { AxiosError } from 'axios'
import { AUTH_ERROR_CODES } from '~/constants/error-codes'
import HttpStatusCode from '~/constants/http-status-code'
import { EntityError } from '~/types/utils.type'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosForbiddenError<ForbiddenError>(error: unknown): error is AxiosError<ForbiddenError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Forbidden
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<{ error_code: string }>(error) &&
    error.response?.data?.error_code === AUTH_ERROR_CODES.TOKEN_EXPIRED
  )
}

export function isAxiosUnverifiedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosForbiddenError<{ error_code: string }>(error) &&
    error.response?.data?.error_code === AUTH_ERROR_CODES.USER_NOT_VERIFIED
  )
}

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

export function isUnprocessableEntityError<FormError>(error: unknown): error is EntityError<FormError> {
  return (
    isFetchBaseQueryError(error) &&
    error.status === 422 &&
    typeof error.data === 'object' &&
    error.data !== null &&
    !(error.data instanceof Array)
  )
}

export function isPasswordLoginNotEnabledError(error: unknown): error is FetchBaseQueryError {
  return (
    isFetchBaseQueryError(error) &&
    error.status === HttpStatusCode.BadRequest &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'error_code' in error.data &&
    (error.data as { error_code: string }).error_code === AUTH_ERROR_CODES.PASSWORD_LOGIN_DISABLED
  )
}
