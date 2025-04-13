import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import {
  CreateNewBoardInvitationBodyType,
  InvitationListResType,
  InvitationResType,
  UpdateBoardInvitationBodyType,
  VerifyBoardInvitationResType
} from '~/schemas/invitation.schema'
import { CommonQueryParams } from '~/types/query-params.type'

const INVITATION_API_URL = '/invitations' as const

const reducerPath = 'invitation/api' as const
const tagTypes = ['Invitation'] as const

export const invitationApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    addNewBoardInvitation: build.mutation<InvitationResType, CreateNewBoardInvitationBodyType & { board_id: string }>({
      query: (body) => ({ url: `${INVITATION_API_URL}/board`, method: 'POST', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message)
        } catch (error) {
          console.error(error)
        }
      }
    }),

    verifyBoardInvitation: build.mutation<VerifyBoardInvitationResType, { invite_token: string }>({
      query: (body) => ({ url: `${INVITATION_API_URL}/verify-board-invitation`, method: 'POST', data: body })
    }),

    updateBoardInvitation: build.mutation<InvitationResType, { id: string; body: UpdateBoardInvitationBodyType }>({
      query: ({ id, body }) => ({ url: `${INVITATION_API_URL}/board/${id}`, method: 'PUT', data: body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Invitation', id }]
    }),

    getInvitations: build.query<InvitationListResType, CommonQueryParams>({
      query: (params) => ({ url: INVITATION_API_URL, method: 'GET', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.invitations.map(({ _id }) => ({ type: 'Invitation' as const, id: _id })),
              { type: 'Invitation' as const, id: 'LIST' }
            ]
          : [{ type: 'Invitation' as const, id: 'LIST' }]
    })
  })
})

export const {
  useAddNewBoardInvitationMutation,
  useGetInvitationsQuery,
  useVerifyBoardInvitationMutation,
  useUpdateBoardInvitationMutation
} = invitationApi

export const invitationApiReducer = invitationApi.reducer

export default invitationApiReducer
