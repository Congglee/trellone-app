import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { UpdateMeBodyType, UserResType } from '~/schemas/user.schema'
import { setProfile } from '~/store/slices/auth.slice'

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
    })
  })
})

export const { useGetMeQuery, useUpdateMeMutation } = userApi

const userApiReducer = userApi.reducer

export default userApiReducer
