import { envConfig } from '~/constants/config'

export const getGoogleAuthUrl = () => {
  const url = 'https://accounts.google.com/o/oauth2/v2/auth'

  const query = {
    client_id: envConfig.googleClientId,
    redirect_uri: envConfig.googleRedirectUri,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    ),
    prompt: 'consent',
    access_type: 'offline'
  }

  const queryString = new URLSearchParams(query).toString()

  return `${url}?${queryString}`
}
