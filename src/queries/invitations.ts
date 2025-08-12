import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import {
  CreateNewBoardInvitationBodyType,
  CreateNewWorkspaceInvitationBodyType,
  InvitationListResType,
  InvitationResType,
  UpdateBoardInvitationBodyType,
  UpdateBoardInvitationResType,
  UpdateWorkspaceInvitationBodyType,
  UpdateWorkspaceInvitationResType,
  VerifyInvitationResType
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
    addNewWorkspaceInvitation: build.mutation<
      InvitationResType,
      CreateNewWorkspaceInvitationBodyType & { workspace_id: string }
    >({
      query: (body) => ({ url: `${INVITATION_API_URL}/workspace`, method: 'POST', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message)
        } catch (error) {
          console.error(error)
        }
      }
    }),

    addNewBoardInvitation: build.mutation<
      InvitationResType,
      CreateNewBoardInvitationBodyType & { board_id: string; workspace_id: string }
    >({
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

    verifyInvitation: build.mutation<VerifyInvitationResType, { invite_token: string }>({
      query: (body) => ({ url: `${INVITATION_API_URL}/verify-invitation`, method: 'POST', data: body })
    }),

    updateWorkspaceInvitation: build.mutation<
      UpdateWorkspaceInvitationResType,
      { id: string; body: UpdateWorkspaceInvitationBodyType }
    >({
      query: ({ id, body }) => ({ url: `${INVITATION_API_URL}/workspace/${id}`, method: 'PUT', data: body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Invitation', id },
        { type: 'Invitation', id: 'LIST' }
      ]
    }),

    updateBoardInvitation: build.mutation<
      UpdateBoardInvitationResType,
      { id: string; body: UpdateBoardInvitationBodyType }
    >({
      query: ({ id, body }) => ({ url: `${INVITATION_API_URL}/board/${id}`, method: 'PUT', data: body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Invitation', id },
        { type: 'Invitation', id: 'LIST' }
      ]
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
  useAddNewWorkspaceInvitationMutation,
  useAddNewBoardInvitationMutation,
  useGetInvitationsQuery,
  useVerifyInvitationMutation,
  useUpdateBoardInvitationMutation,
  useUpdateWorkspaceInvitationMutation
} = invitationApi

export const invitationApiReducer = invitationApi.reducer

export default invitationApiReducer
