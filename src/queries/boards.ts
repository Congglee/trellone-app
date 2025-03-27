import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import {
  BoardResType,
  MoveCardToDifferentColumnBodyType,
  MoveCardToDifferentColumnResType,
  UpdateBoardBodyType
} from '~/schemas/board.schema'

const BOARD_API_URL = '/boards' as const

const reducerPath = 'board/api' as const
const tagTypes = ['Board'] as const

export const boardApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    updateBoard: build.mutation<BoardResType, { id: string; body: UpdateBoardBodyType }>({
      query: ({ id, body }) => ({ url: `${BOARD_API_URL}/${id}`, method: 'PUT', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error updating the board')
          console.error(error)
        }
      }
    }),

    moveCardToDifferentColumn: build.mutation<MoveCardToDifferentColumnResType, MoveCardToDifferentColumnBodyType>({
      query: (body) => ({ url: `${BOARD_API_URL}/supports/moving-card`, method: 'PUT', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error moving the card to a different column')
          console.error(error)
        }
      }
    })
  })
})

export const { useUpdateBoardMutation, useMoveCardToDifferentColumnMutation } = boardApi

const boardApiReducer = boardApi.reducer

export default boardApiReducer
