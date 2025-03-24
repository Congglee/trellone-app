import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { envConfig } from '~/constants/config'
import HttpStatusCode from '~/constants/http-status-code'
import { interceptorLoadingElements } from '~/utils/utils'

export class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: envConfig.baseUrl,
      timeout: 1000 * 60 * 10, // 10 minutes
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })

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
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message

          toast.error(message)
        }

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
