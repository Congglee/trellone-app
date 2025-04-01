import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '~/lib/redux/helpers'
import { UploadImageResType } from '~/schemas/media.schema'

const MEDIAS_API_URL = '/medias' as const

const reducerPath = 'media/api' as const
const tagTypes = ['Media'] as const

export const mediaApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    uploadImage: build.mutation<UploadImageResType, FormData>({
      query: (body) => ({
        url: `${MEDIAS_API_URL}/upload-image`,
        method: 'POST',
        data: body,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    })
  })
})

export const { useUploadImageMutation } = mediaApi

const mediaApiReducer = mediaApi.reducer

export default mediaApiReducer
