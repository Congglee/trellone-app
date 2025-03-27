import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import useQueryConfig from '~/hooks/use-query-config'
import { useAppDispatch } from '~/lib/redux/hooks'
import { userApi } from '~/queries/users'
import { setAuthenticated, setProfile } from '~/store/slices/auth.slice'
import { OAuthQueryParams } from '~/types/query-params.type'

export default function OAuth() {
  const { access_token, refresh_token } = useQueryConfig<OAuthQueryParams>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (access_token && refresh_token) {
      dispatch(userApi.endpoints.getMe.initiate(undefined)).then((res) => {
        if (!res.error) {
          const profile = res.data?.result

          dispatch(setAuthenticated(true))
          dispatch(setProfile(profile))

          navigate('/')
        }
      })
    }
  }, [access_token, dispatch, navigate, refresh_token])

  return <PageLoadingSpinner caption='Redirecting...' />
}
