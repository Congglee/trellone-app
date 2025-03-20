import { createApi } from '@reduxjs/toolkit/query/react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { BoardResType, UpdateBoardBodyType } from '~/schemas/board.schema'
import { ColumnType } from '~/schemas/column.schema'
import { mapOrder } from '~/utils/sorts'
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
          // columns according to column_order_ids before further processing
          const sortedColumns = mapOrder(boardRes.result.columns, boardRes.result.column_order_ids, '_id')

          // Creating a new result object with updated columns - proper immutable approach
          boardRes.result = {
            ...boardRes.result,

            // Using map to create new column objects rather than modifying in-place
            columns: sortedColumns.map((column) => {
              if (isEmpty(column.cards)) {
                const placeholderCard = generatePlaceholderCard(column)
                // Creating a new column with the placeholder card - correctly avoiding mutations
                return {
                  ...column,
                  cards: [placeholderCard],
                  card_order_ids: [placeholderCard._id]
                }
              } else {
                // If cards are not empty, sort them according to card_order_ids
                const sortedCards = mapOrder(column.cards, column.card_order_ids, '_id')

                return { ...column, cards: sortedCards }
              }
            })
          }
        }

        return boardRes
      },
      providesTags: (result, _error, id) =>
        result ? [{ type: 'Board', id: result.result._id }] : [{ type: 'Board', id }]
    }),

    updateBoard: build.mutation<
      BoardResType,
      {
        id: string
        body: UpdateBoardBodyType & { dnd_ordered_columns?: ColumnType[] }
      }
    >({
      query: ({ id, body }) => ({ url: `${BOARD_API_URL}/${id}`, method: 'PUT', data: body }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const updateBoardResult = dispatch(
          boardApi.util.updateQueryData('getBoard', id, (draft) => {
            if (draft.result) {
              const dndOrderedColumns = body.dnd_ordered_columns
              const dndOrderedColumnsIds = body.column_order_ids

              // Updating the board's columns and card order IDs in the cache
              // These take precedence over any column data in body
              if (dndOrderedColumns) {
                draft.result.columns = dndOrderedColumns
              }

              if (dndOrderedColumnsIds) {
                draft.result.column_order_ids = dndOrderedColumnsIds
              }

              // Update all board properties from the bodyUpdate
              Object.assign(draft.result, body)
            }
          })
        )

        try {
          await queryFulfilled
        } catch (error) {
          // Rollback the optimistic update if the query fails
          updateBoardResult.undo()

          toast.error('There was an error updating the board')
          console.error(error)
        }
      }
    })
  })
})

export const { useGetBoardQuery, useUpdateBoardMutation } = boardApi

const boardApiReducer = boardApi.reducer

export default boardApiReducer
