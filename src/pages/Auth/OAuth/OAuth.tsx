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
    if (access_token && refresh_token) {
      setAccessTokenToLS(access_token)
      setRefreshTokenToLS(refresh_token)

      setAccessTokenFromLS(getAccessTokenFromLS())
    }
  }, [access_token, refresh_token])

  useEffect(() => {
    if (accessTokenFromLS) {
      dispatch(userApi.endpoints.getMe.initiate(undefined)).then((res) => {
        if (!res.error) {
          const profile = res.data?.result

          dispatch(setAuthenticated(true))
          dispatch(setProfile(profile))

          navigate('/')
        }
      })
    }
  }, [accessTokenFromLS, dispatch, navigate])

  return <PageLoadingSpinner caption='Redirecting...' />
}
