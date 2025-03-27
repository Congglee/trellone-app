import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { envConfig } from '~/constants/config'
import HttpStatusCode from '~/constants/http-status-code'
import { AppStore } from '~/lib/redux/store'
import { AUTH_API_URL, authApi } from '~/queries/auth'
import { AuthResType } from '~/schemas/auth.schema'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from '~/utils/error-handlers'
import { interceptorLoadingElements } from '~/utils/utils'

let axiosReduxStore: AppStore

export const injectStore = (mainStore: AppStore) => {
  axiosReduxStore = mainStore
}

export class Http {
  instance: AxiosInstance
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.instance = axios.create({
      baseURL: envConfig.baseUrl,
      timeout: 1000 * 60 * 10, // 10 minutes
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
    this.refreshTokenRequest = null

    this.instance.interceptors.request.use(
      (config) => {
        interceptorLoadingElements(true)
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        interceptorLoadingElements(false)
        return response
      },
      (error: AxiosError) => {
        interceptorLoadingElements(false)

        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message

          toast.error(message)
        }

        if (isAxiosUnauthorizedError(error)) {
          const config = error.response?.config as InternalAxiosRequestConfig
          const { url } = config

          if (isAxiosExpiredTokenError(error) && url !== `${AUTH_API_URL}/refresh-token`) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })

            return this.refreshTokenRequest.then(() => {
              return this.instance(config)
            })
          }

          axiosReduxStore.dispatch(authApi.endpoints.logout.initiate(undefined))
        }

        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post<AuthResType>(`${AUTH_API_URL}/refresh-token`)
      .then((res) => {
        const access_token = res.data.result.access_token
        return access_token
      })
      .catch((error) => {
        axiosReduxStore.dispatch(authApi.endpoints.logout.initiate(undefined))
        throw error
      })
  }
}

const http = new Http().instance

export default http
