import { createApi } from '@reduxjs/toolkit/query/react'
import { isEmpty } from 'lodash'
import axiosBaseQuery from '~/lib/redux/helpers'
import { BoardResType } from '~/schemas/board.schema'
import { generatePlaceholderCard } from '~/utils/utils'

const BOARD_API_URL = '/boards' as const

const reducerPath = 'board/api' as const
const tagTypes = ['Board'] as const

export const boardApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getBoard: build.query<BoardResType, string>({
      query: (id) => ({ url: `${BOARD_API_URL}/${id}`, method: 'GET' }),
      // Should use `transformResponse` to create a new transformed object.
      transformResponse: (response: BoardResType) => {
        // RTK Query freezes response data to prevent mutations, which is causing the error.

        // So creating a shadow copy of the response to avoid mutating the original object
        const boardRes = { ...response }

        if (boardRes.result?.columns) {
          // Creating a new result object with updated columns - proper immutable approach
          boardRes.result = {
            ...boardRes.result,
            // Using map to create new column objects rather than modifying in-place
            columns: boardRes.result.columns.map((column) => {
              if (isEmpty(column.cards)) {
                const placeholderCard = generatePlaceholderCard(column)
                // Creating a new column with the placeholder card - correctly avoiding mutations
                return {
                  ...column,
                  cards: [placeholderCard],
                  card_order_ids: [placeholderCard._id]
                }
              }
              return column
            })
          }
        }

        return boardRes
      },
      providesTags: (result, _error, id) =>
        result ? [{ type: 'Board', id: result.result._id }] : [{ type: 'Board', id }]
    })
  })
})

export const { useGetBoardQuery } = boardApi

const boardApiReducer = boardApi.reducer

export default boardApiReducer
