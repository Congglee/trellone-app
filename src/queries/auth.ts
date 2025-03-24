import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '~/lib/redux/helpers'
import { AuthResType, LoginBodyType } from '~/schemas/auth.schema'
import { setAuthenticated } from '~/store/slices/auth.slice'

const AUTH_API_URL = '/auth' as const

const reducerPath = 'auth/api' as const
const tagTypes = ['Auth'] as const

export const authApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    login: build.mutation<AuthResType, LoginBodyType>({
      query: (body) => ({ url: `${AUTH_API_URL}/login`, method: 'POST', data: body }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(setAuthenticated(true))
        } catch (error: any) {
          console.error(error)
        }
      }
    })
  })
})

export const { useLoginMutation } = authApi

const authApiReducer = authApi.reducer

export default authApiReducer
