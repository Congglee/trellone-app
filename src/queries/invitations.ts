import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { CreateNewBoardInvitationBodyType, InvitationResType } from '~/schemas/invitation.schema'

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
          toast.error('There was an error sending the invitation')
          console.error(error)
        }
      }
    })
  })
})

export const { useAddNewBoardInvitationMutation } = invitationApi

export const invitationApiReducer = invitationApi.reducer

export default invitationApiReducer
