import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import path from '~/constants/path'
import { BoardInvitationStatus } from '~/constants/type'
import { useQueryConfig } from '~/hooks/use-query-config'
import { decodeToken } from '~/lib/jwt-decode'
import { useUpdateBoardInvitationMutation, useVerifyBoardInvitationMutation } from '~/queries/invitations'
import { InviteTokenPayload } from '~/types/jwt.type'
import { BoardInvitationQueryParams } from '~/types/query-params.type'

export default function BoardInvitationVerification() {
  const { token, board_id } = useQueryConfig<BoardInvitationQueryParams>()
  const navigate = useNavigate()

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

  // If the invitation is verified successfully, update the invitation status to accepted
  useEffect(() => {
    if (isVerifyBoardInvitationSuccess && token) {
      const invitationId = decodeToken<InviteTokenPayload>(token as string).invitation_id

      updateBoardInvitationMutation({
        id: invitationId,
        body: { status: BoardInvitationStatus.Accepted }
      })
    }
  }, [isVerifyBoardInvitationSuccess, token])

  // If the invitation is updated successfully, navigate to the board details page
  useEffect(() => {
    if (isUpdateBoardInvitationSuccess) {
      navigate(`/boards/${board_id}`)
    }
  }, [isUpdateBoardInvitationSuccess, navigate, board_id])

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
