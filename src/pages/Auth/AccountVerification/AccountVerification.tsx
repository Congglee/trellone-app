import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import useQueryConfig from '~/hooks/use-query-config'
import { useVerifyEmailMutation } from '~/queries/auth'
import { AuthQueryParams } from '~/types/query-params.type'

export default function AccountVerification() {
  const { token, email } = useQueryConfig<AuthQueryParams>()

  const [verifyEmailMutation, { isLoading }] = useVerifyEmailMutation()

  useEffect(() => {
    if (token && email) {
      verifyEmailMutation({ email_verify_token: token })
    }
  }, [token, email])

  if (!token || !email) {
    return <Navigate to='/404' />
  }

  if (isLoading) {
    return <PageLoadingSpinner caption='Verifying your account...' />
  }

  return <Navigate to={`/login?verified_email=${email}`} />
}
