import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import path from '~/constants/path'
import { BoardInvitationStatus } from '~/constants/type'
import useQueryConfig from '~/hooks/use-query-config'
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

  useEffect(() => {
    if (token) {
      verifyBoardInvitationMutation({ invite_token: token })
    }
  }, [token])

  useEffect(() => {
    if (isVerifyBoardInvitationSuccess && token) {
      const invitationId = decodeToken<InviteTokenPayload>(token as string).invitation_id

      updateBoardInvitationMutation({
        id: invitationId,
        body: { status: BoardInvitationStatus.Accepted }
      })
    }
  }, [isVerifyBoardInvitationSuccess, token])

  useEffect(() => {
    if (isUpdateBoardInvitationSuccess) {
      navigate(`/boards/${board_id}`)
    }
  }, [isUpdateBoardInvitationSuccess, navigate, board_id])

  useEffect(() => {
    if (isVerifyBoardInvitationError || isUpdateBoardInvitationError) {
      navigate(path.login)
    }
  }, [isVerifyBoardInvitationError, isUpdateBoardInvitationError, navigate, board_id])

  if (!token || !board_id) {
    return <Navigate to='/404' />
  }

  if (isLoading) {
    return <PageLoadingSpinner caption='Verifying your board invitation...' />
  }

  return null
}
