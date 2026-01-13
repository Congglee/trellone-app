import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import SEO from '~/components/SEO'
import path from '~/constants/path'
import { WorkspaceInvitationStatus } from '~/constants/type'
import { useQueryConfig } from '~/hooks/use-query-config'
import { decodeToken } from '~/lib/jwt-decode'
import { useUpdateWorkspaceInvitationMutation, useVerifyInvitationMutation } from '~/queries/invitations'
import { InviteTokenPayload } from '~/types/jwt.type'
import { WorkspaceInvitationQueryParams } from '~/types/query-params.type'

export default function WorkspaceInvitationVerification() {
  const { token, workspace_id } = useQueryConfig<WorkspaceInvitationQueryParams>()
  const navigate = useNavigate()

  const [
    verifyInvitationMutation,
    { isSuccess: isVerifyInvitationSuccess, isLoading: isVerifyInvitationLoading, isError: isVerifyInvitationError }
  ] = useVerifyInvitationMutation()

  const [
    updateWorkspaceInvitationMutation,
    {
      isLoading: isUpdateWorkspaceInvitationLoading,
      isSuccess: isUpdateWorkspaceInvitationSuccess,
      isError: isUpdateWorkspaceInvitationError,
      error: updateWorkspaceInvitationError
    }
  ] = useUpdateWorkspaceInvitationMutation()

  const isLoading = isVerifyInvitationLoading || isUpdateWorkspaceInvitationLoading

  // Once there is a verification token on the URL, verify the invitation
  useEffect(() => {
    if (token) {
      verifyInvitationMutation({ invite_token: token })
    }
  }, [token])

  // If the invitation is verified successfully, update the invitation status to accepted and set the invitee
  useEffect(() => {
    const updateWorkspaceInvitation = async () => {
      if (isVerifyInvitationSuccess && token) {
        const invitationId = decodeToken<InviteTokenPayload>(token as string).invitation_id

        await updateWorkspaceInvitationMutation({
          id: invitationId,
          body: { status: WorkspaceInvitationStatus.Accepted }
        })
      }
    }

    updateWorkspaceInvitation()
  }, [isVerifyInvitationSuccess, token])

  // If the invitation is updated successfully, emit socket event to notify other users about the new member addition and navigate to the board details page
  useEffect(() => {
    if (isUpdateWorkspaceInvitationSuccess) {
      // TODO: emit socket event to notify other users about the new member addition

      navigate(`/workspaces/${workspace_id}/boards`)
    }
  }, [isUpdateWorkspaceInvitationSuccess, navigate, workspace_id])

  // If there is an error, navigate to the login page
  useEffect(() => {
    if (isVerifyInvitationError || isUpdateWorkspaceInvitationError) {
      navigate(path.login)

      const errorMessage =
        (updateWorkspaceInvitationError as any)?.data?.message || 'There was an error verifying your invitation'

      toast.error(errorMessage)
    }
  }, [
    isVerifyInvitationError,
    isUpdateWorkspaceInvitationError,
    navigate,
    workspace_id,
    updateWorkspaceInvitationError
  ])

  // If there is no token or workspace_id on the URL, navigate to the 404 page (this prevent the user from accessing the page directly)
  if (!token || !workspace_id) {
    return <Navigate to='/404' />
  }

  if (isLoading) {
    return (
      <>
        <SEO
          title='Verify Workspace Invitation'
          description='Verifying your workspace invitation. Please wait…'
          noIndex
          noFollow
          canonicalPath={path.workspaceInvitationVerification}
        />
        <PageLoadingSpinner caption='Verifying your workspace invitation...' />
      </>
    )
  }

  return (
    <SEO
      title='Verify Workspace Invitation'
      description='Completing your workspace invitation verification.'
      noIndex
      noFollow
      canonicalPath={path.workspaceInvitationVerification}
    />
  )
}
