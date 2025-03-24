import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '~/lib/redux/helpers'
import { UserResType } from '~/schemas/user.schema'

const USERS_API_URL = '/users' as const

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
    })
  })
})

export const { useGetMeQuery } = userApi

const userApiReducer = userApi.reducer

export default userApiReducer
