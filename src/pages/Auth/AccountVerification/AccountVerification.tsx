import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import path from '~/constants/path'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useAppSelector } from '~/lib/redux/hooks'
import { useLogoutMutation, useVerifyEmailMutation } from '~/queries/auth'
import { AuthQueryParams } from '~/types/query-params.type'

export default function AccountVerification() {
  const { token, email } = useQueryConfig<AuthQueryParams>()
  const { profile, isAuthenticated } = useAppSelector((state) => state.auth)

  const [verifyEmailMutation, { isLoading, isSuccess }] = useVerifyEmailMutation()
  const [logoutMutation] = useLogoutMutation()

  // If the user is already authenticated, then logout to get a new access token
  useEffect(() => {
    if (isAuthenticated && profile) {
      logoutMutation().then((res) => {
        if (!res.error) {
          toast.info('Please login again to enjoy our services')
        }
      })
    }
  }, [isAuthenticated, profile])

  // Once there is a token and email on the URL, verify the email
  useEffect(() => {
    if (token && email) {
      verifyEmailMutation({ email_verify_token: token })
    }
  }, [token, email])

  // Prevent users from accessing this page by entering the URL directly (404)
  if (!token || !email) {
    return <Navigate to='/404' />
  }

  if (isLoading) {
    return <PageLoadingSpinner caption='Verifying your account...' />
  }

  return isSuccess ? <Navigate to={`${path.login}?verified_email=${email}`} /> : <Navigate to={path.login} />
}
