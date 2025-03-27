import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import path from '~/constants/path'
import useQueryConfig from '~/hooks/use-query-config'
import { useVerifyEmailMutation } from '~/queries/auth'
import { AuthQueryParams } from '~/types/query-params.type'

export default function AccountVerification() {
  const { token, email } = useQueryConfig<AuthQueryParams>()

  const [verifyEmailMutation, { isLoading, isSuccess }] = useVerifyEmailMutation()

  useEffect(() => {
    if (token && email) {
      verifyEmailMutation({ email_verify_token: token })
    }
  }, [token, email])

  // Prevent users from accessing this page by entering the URL directly
  if (!token || !email) {
    return <Navigate to='/404' />
  }

  if (isLoading) {
    return <PageLoadingSpinner caption='Verifying your account...' />
  }

  return isSuccess ? <Navigate to={`${path.login}?verified_email=${email}`} /> : <Navigate to={path.login} />
}
