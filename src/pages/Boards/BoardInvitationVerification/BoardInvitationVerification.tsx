import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import path from '~/constants/path'
import { BoardInvitationStatus } from '~/constants/type'
import { useQueryConfig } from '~/hooks/use-query-config'
import { decodeToken } from '~/lib/jwt-decode'
import { useAppSelector } from '~/lib/redux/hooks'
import { useUpdateBoardInvitationMutation, useVerifyBoardInvitationMutation } from '~/queries/invitations'
import { UserType } from '~/schemas/user.schema'
import { InviteTokenPayload } from '~/types/jwt.type'
import { BoardInvitationQueryParams } from '~/types/query-params.type'

export default function BoardInvitationVerification() {
  const { token, board_id } = useQueryConfig<BoardInvitationQueryParams>()
  const navigate = useNavigate()

  const [invitee, setInvitee] = useState<UserType | null>(null)

  const { socket } = useAppSelector((state) => state.app)

  const [
    verifyBoardInvitationMutation,
    {
      isSuccess: isVerifyBoardInvitationSuccess,
      isLoading: isVerifyBoardInvitationLoading,
      isError: isVerifyBoardInvitationError
    }
  ] = useVerifyBoardInvitationMutation()

  const [
    updateBoardInvitationMutation,
    {
      isLoading: isUpdateBoardInvitationLoading,
      isSuccess: isUpdateBoardInvitationSuccess,
      isError: isUpdateBoardInvitationError
    }
  ] = useUpdateBoardInvitationMutation()

  const isLoading = isVerifyBoardInvitationLoading || isUpdateBoardInvitationLoading

  // Once there is a verification token on the URL, verify the invitation
  useEffect(() => {
    if (token) {
      verifyBoardInvitationMutation({ invite_token: token })
    }
  }, [token])

  // If the invitation is verified successfully, update the invitation status to accepted and set the invitee
  useEffect(() => {
    const updateBoardInvitation = async () => {
      if (isVerifyBoardInvitationSuccess && token) {
        const invitationId = decodeToken<InviteTokenPayload>(token as string).invitation_id

        const updateBoardInvitationRes = await updateBoardInvitationMutation({
          id: invitationId,
          body: { status: BoardInvitationStatus.Accepted }
        }).unwrap()

        const invitee = updateBoardInvitationRes.result.invitee

        setInvitee(invitee)
      }
    }

    updateBoardInvitation()
  }, [isVerifyBoardInvitationSuccess, token])

  // If the invitation is updated successfully, emit socket event to notify other users about the new member addition and navigate to the board details page
  useEffect(() => {
    if (isUpdateBoardInvitationSuccess) {
      if (invitee) {
        socket?.emit('CLIENT_USER_ACCEPTED_BOARD_INVITATION', { boardId: board_id, invitee })
      }

      navigate(`/boards/${board_id}`)
    }
  }, [isUpdateBoardInvitationSuccess, navigate, board_id, invitee, socket])

  // If there is an error, navigate to the login page
  useEffect(() => {
    if (isVerifyBoardInvitationError || isUpdateBoardInvitationError) {
      navigate(path.login)
    }
  }, [isVerifyBoardInvitationError, isUpdateBoardInvitationError, navigate, board_id])

  // If there is no token or board_id on the URL, navigate to the 404 page (this prevent the user from accessing the page directly)
  if (!token || !board_id) {
    return <Navigate to='/404' />
  }

  if (isLoading) {
    return <PageLoadingSpinner caption='Verifying your board invitation...' />
  }

  return null
}
