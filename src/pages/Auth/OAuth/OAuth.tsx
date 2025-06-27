import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useAppDispatch } from '~/lib/redux/hooks'
import { userApi } from '~/queries/users'
import { setAuthenticated, setProfile } from '~/store/slices/auth.slice'
import { OAuthQueryParams } from '~/types/query-params.type'
import { getAccessTokenFromLS, setAccessTokenToLS, setRefreshTokenToLS } from '~/utils/storage'

export default function OAuth() {
  const { access_token, refresh_token } = useQueryConfig<OAuthQueryParams>()

  const [accessTokenFromLS, setAccessTokenFromLS] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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

          navigate('/')
        }
      })
    }
  }, [accessTokenFromLS, dispatch, navigate])

  return <PageLoadingSpinner caption='Redirecting...' />
}
