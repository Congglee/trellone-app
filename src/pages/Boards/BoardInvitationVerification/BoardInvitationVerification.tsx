import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import useQueryConfig from '~/hooks/use-query-config'
import { useVerifyBoardInvitationMutation } from '~/queries/invitations'
import { BoardInvitationQueryParams } from '~/types/query-params.type'

export default function BoardInvitationVerification() {
  const { token } = useQueryConfig<BoardInvitationQueryParams>()

  const [verifyBoardInvitationMutation, { isLoading }] = useVerifyBoardInvitationMutation()

  useEffect(() => {
    if (token) {
      verifyBoardInvitationMutation({ invite_token: token })
    }
  }, [token])

  if (!token) {
    return <Navigate to='/404' />
  }

  if (isLoading) {
    return <PageLoadingSpinner caption='Verifying your board invitation...' />
  }

  return <div>BoardInvitationVerification</div>
}
