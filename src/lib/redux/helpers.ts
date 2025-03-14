import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import http from '~/lib/http'

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: AxiosRequestConfig['url']
      method?: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
      headers?: AxiosRequestConfig['headers']
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await http.request({
        url,
        method,
        data,
        params,
        headers
      })

      return { data: result.data }
    } catch (axiosError) {
      const error = axiosError as AxiosError
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message
        }
      }
    }
  }

export default axiosBaseQuery
