import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import path from '~/constants/path'
import { UserVerifyStatus } from '~/constants/type'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useAppDispatch } from '~/lib/redux/hooks'
import { userApi } from '~/queries/users'
import { setAuthenticated, setProfile } from '~/store/slices/auth.slice'
import { OAuthQueryParams } from '~/types/query-params.type'
import { getAccessTokenFromLS, setAccessTokenToLS, setRefreshTokenToLS } from '~/utils/storage'

export default function OAuth() {
  const { access_token, refresh_token, new_user, verify } = useQueryConfig<OAuthQueryParams>()

  const [accessTokenFromLS, setAccessTokenFromLS] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Parse query params (they come as strings from URL)
  const newUserValue = new_user !== undefined ? Number(new_user) : undefined
  const verifyValue = verify !== undefined ? Number(verify) : undefined

  useEffect(() => {
    // Once there is a token and refresh token on the URL
    if (access_token && refresh_token) {
      // Set the access token and refresh token to the local storage
      setAccessTokenToLS(access_token)
      setRefreshTokenToLS(refresh_token)

      setAccessTokenFromLS(getAccessTokenFromLS())
    }
  }, [access_token, refresh_token])

  useEffect(() => {
    // Once there is a access token from the local storage
    if (accessTokenFromLS) {
      // Get the user's profile
      dispatch(userApi.endpoints.getMe.initiate(undefined)).then((res) => {
        if (!res.error) {
          const profile = res.data?.result

          // Set the user's profile to the redux store
          dispatch(setAuthenticated(true))
          dispatch(setProfile(profile))

          // Handle new user vs existing user flow
          if (newUserValue === 1) {
            toast.success(
              '🎉 Welcome to Trellone! Your account has been successfully created with Google and a new workspace is ready for you.'
            )
            toast.success("Let's start organizing your projects!")
          }

          // Ensure user is verified (OAuth always sets verify to Verified)
          if (verifyValue !== undefined && verifyValue !== UserVerifyStatus.Verified) {
            // Future: handle non-verified OAuth users if needed
            console.warn('OAuth user verify status is not Verified:', verifyValue)
          }

          navigate(path.home)
        }
      })
    }
  }, [accessTokenFromLS, dispatch, navigate, newUserValue, verifyValue])

  return <PageLoadingSpinner caption='Redirecting...' />
}
