import { createApi } from '@reduxjs/toolkit/query/react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { BoardResType, UpdateBoardBodyType } from '~/schemas/board.schema'
import { ColumnType } from '~/schemas/column.schema'
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
    }),

    updateBoard: build.mutation<
      BoardResType,
      { id: string; dndOrderedColumns: ColumnType[]; body: UpdateBoardBodyType }
    >({
      query: ({ id, body }) => ({ url: `${BOARD_API_URL}/${id}`, method: 'PUT', data: body }),
      async onQueryStarted({ id, dndOrderedColumns, body }, { dispatch, queryFulfilled }) {
        const updateBoardResult = dispatch(
          boardApi.util.updateQueryData('getBoard', id, (draft) => {
            if (draft?.result) {
              const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)

              // Updating the board's columns and card order IDs in the cache
              // These take precedence over any column data in body
              draft.result.columns = dndOrderedColumns
              draft.result.column_order_ids = dndOrderedColumnsIds

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
