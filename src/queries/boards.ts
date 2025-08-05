import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { BoardListResType, BoardResType, CreateBoardBodyType, UpdateBoardBodyType } from '~/schemas/board.schema'
import { BoardQueryParams } from '~/types/query-params.type'

const BOARD_API_URL = '/boards' as const

const reducerPath = 'board/api' as const
const tagTypes = ['Board'] as const

export const boardApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    addBoard: build.mutation<BoardResType, CreateBoardBodyType>({
      query: (body) => ({ url: BOARD_API_URL, method: 'POST', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error creating the board')
          console.error(error)
        }
      },
      invalidatesTags: [{ type: 'Board', id: 'LIST' }]
    }),

    getBoards: build.query<BoardListResType, BoardQueryParams>({
      query: (params) => ({ url: BOARD_API_URL, method: 'GET', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.boards.map(({ _id }) => ({ type: 'Board' as const, id: _id })),
              { type: 'Board' as const, id: 'LIST' }
            ]
          : [{ type: 'Board' as const, id: 'LIST' }]
    }),

    updateBoard: build.mutation<BoardResType, { id: string; body: UpdateBoardBodyType }>({
      query: ({ id, body }) => ({ url: `${BOARD_API_URL}/${id}`, method: 'PUT', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error updating the board')
          console.error(error)
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Board', id },
        { type: 'Board', id: 'LIST' }
      ]
    })
  })
})

export const { useAddBoardMutation, useGetBoardsQuery, useUpdateBoardMutation } = boardApi

const boardApiReducer = boardApi.reducer

export default boardApiReducer
