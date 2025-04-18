import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '~/lib/redux/helpers'
import { UnsplashSearchPhotosType, UploadImageResType } from '~/schemas/media.schema'

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
    }),

    getUnsplashSearchPhotos: build.query<UnsplashSearchPhotosType, string>({
      query: (params) => ({
        url: `${MEDIAS_API_URL}/unsplash/search/get-photos`,
        method: 'GET',
        params: { query: params }
      })
    })
  })
})

export const { useUploadImageMutation, useGetUnsplashSearchPhotosQuery } = mediaApi

const mediaApiReducer = mediaApi.reducer

export default mediaApiReducer
