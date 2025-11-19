import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { authApi } from '~/queries/auth'
import {
  ChangePasswordBodyType,
  ChangePasswordResType,
  EnablePasswordLoginBodyType,
  EnablePasswordLoginResType,
  UpdateMeBodyType,
  UserResType
} from '~/schemas/user.schema'
import { setProfile } from '~/store/slices/auth.slice'

export const USERS_API_URL = '/users' as const

const reducerPath = 'user/api' as const
const tagTypes = ['User'] as const

export const userApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getMe: build.query<UserResType, void>({
      query: () => ({ url: `${USERS_API_URL}/me`, method: 'GET' }),
      providesTags: (result) => (result ? [{ type: 'User', id: result.result._id }] : tagTypes)
    }),

    updateMe: build.mutation<UserResType, UpdateMeBodyType>({
      query: (body) => ({ url: `${USERS_API_URL}/me`, method: 'PATCH', data: body }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const profile = data.result

          dispatch(setProfile(profile))

          toast.success(data.message)
        } catch (error: any) {
          console.error(error)
        }
      },
      invalidatesTags: (result) => (result ? [{ type: 'User', id: result.result._id }] : tagTypes)
    }),

    changePassword: build.mutation<ChangePasswordResType, ChangePasswordBodyType>({
      query: (body) => ({ url: `${USERS_API_URL}/change-password`, method: 'PUT', data: body }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message)

          dispatch(authApi.endpoints.logout.initiate(undefined))
        } catch (error: any) {
          console.error(error)
        }
      }
    }),

    enablePasswordLogin: build.mutation<EnablePasswordLoginResType, EnablePasswordLoginBodyType>({
      query: (body) => ({ url: `${USERS_API_URL}/enable-password-login`, method: 'POST', data: body }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message)

          dispatch(authApi.endpoints.logout.initiate(undefined))
        } catch (error: any) {
          console.error(error)
        }
      }
    })
  })
})

export const { useGetMeQuery, useUpdateMeMutation, useChangePasswordMutation, useEnablePasswordLoginMutation } = userApi

const userApiReducer = userApi.reducer

export default userApiReducer
