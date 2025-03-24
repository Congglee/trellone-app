import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import axios, { AxiosError } from 'axios'
import HttpStatusCode from '~/constants/http-status-code'
import { EntityError } from '~/types/utils.type'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosUnauthorizedError<{ message: string }>(error) && error.response?.data?.message === 'Jwt expired'
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
