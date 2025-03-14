import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '~/lib/redux/helpers'
import { Board } from '~/types/board.type'
import { SuccessResponse } from '~/types/response.type'

const BOARD_API_URL = '/boards' as const

const reducerPath = 'board/api' as const
const tagTypes = ['Board'] as const

export const boardApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getBoard: build.query<SuccessResponse<Board>, string>({
      query: (id) => ({ url: `${BOARD_API_URL}/${id}`, method: 'GET' }),
      providesTags: (result, _error, id) =>
        result ? [{ type: 'Board', id: result.result._id }] : [{ type: 'Board', id }]
    })
  })
})

export const { useGetBoardQuery } = boardApi

const boardApiReducer = boardApi.reducer

export default boardApiReducer
