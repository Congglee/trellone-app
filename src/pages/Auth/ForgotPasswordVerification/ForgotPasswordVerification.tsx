import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import SEO from '~/components/SEO'
import path from '~/constants/path'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useVerifyForgotPasswordMutation } from '~/queries/auth'
import { AuthQueryParams } from '~/types/query-params.type'

export default function ForgotPasswordVerification() {
  const { token } = useQueryConfig<AuthQueryParams>()

  const [verifyForgotPasswordMutation, { isLoading }] = useVerifyForgotPasswordMutation()

  // Once there is a token on the URL, verify the forgot password request
  useEffect(() => {
    if (token) {
      verifyForgotPasswordMutation({ forgot_password_token: token })
    }
  }, [token])

  // Prevent users from accessing this page by entering the URL directly (404)
  if (!token) {
    return <Navigate to='/404' />
  }

  if (isLoading) {
    return (
      <>
        <SEO
          title='Verify Password Reset Request'
          description='Verifying your password reset request. Please wait…'
          noIndex
          noFollow
          canonicalPath={path.forgotPasswordVerification}
        />
        <PageLoadingSpinner caption='Verifying your forgot password request...' />
      </>
    )
  }

  return <Navigate to={`/reset-password?forgot_password_token=${token}`} />
}
