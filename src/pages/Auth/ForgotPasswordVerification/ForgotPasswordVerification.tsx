import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useVerifyForgotPasswordMutation } from '~/queries/auth'
import { AuthQueryParams } from '~/types/query-params.type'

export default function ForgotPasswordVerification() {
  const { token } = useQueryConfig<AuthQueryParams>()

  const [verifyForgotPasswordMutation, { isLoading }] = useVerifyForgotPasswordMutation()

  useEffect(() => {
    if (token) {
      verifyForgotPasswordMutation({ forgot_password_token: token })
    }
  }, [token])

  if (!token) {
    return <Navigate to='/404' />
  }

  if (isLoading) {
    return <PageLoadingSpinner caption='Verifying your forgot password request...' />
  }

  return <Navigate to={`/reset-password?forgot_password_token=${token}`} />
}
