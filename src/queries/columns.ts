import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { boardApi } from '~/queries/boards'
import { CardType } from '~/schemas/card.schema'
import { ColumnResType, CreateColumnBodyType, UpdateColumnBodyType } from '~/schemas/column.schema'
import { generatePlaceholderCard } from '~/utils/utils'

const COLUMN_API_URL = '/columns' as const

const reducerPath = 'column/api' as const

const tagTypes = ['Column'] as const

export const columnApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    addColumn: build.mutation<ColumnResType, CreateColumnBodyType>({
      query: (body) => ({ url: COLUMN_API_URL, method: 'POST', data: body }),
      transformResponse: (response: ColumnResType) => {
        const columnRes = { ...response }
        const placeholderCard = generatePlaceholderCard(columnRes.result)

        columnRes.result = {
          ...columnRes.result,
          cards: [placeholderCard],
          card_order_ids: [placeholderCard._id]
        }

        return columnRes
      },
      async onQueryStarted({ board_id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || 'Column added successfully')

          // Optimistically update the board's columns in the cache
          dispatch(
            boardApi.util.updateQueryData('getBoard', board_id, (draft) => {
              // If draft exists and has columns property, update it with the new column
              if (draft.result) {
                const newColumn = data.result

                // Add the new column to the board's columns
                if (!draft.result.columns) {
                  draft.result.columns = []
                }

                draft.result.columns.push(newColumn)

                // Update column_order_ids if it exists
                if (draft.result.column_order_ids) {
                  draft.result.column_order_ids.push(newColumn._id)
                }
              }
            })
          )

          // Invalidate the board cache to ensure the latest data is fetched
          // This will cause the page to reload when the column is successfully added - bad UX
          // dispatch(boardApi.util.invalidateTags([{ type: 'Board', id: board_id }]))
        } catch (error) {
          toast.error('There was an error adding the column')
          console.error(error)
        }
      },
      invalidatesTags: [{ type: 'Column', id: 'LIST' }]
    }),

    updateColumn: build.mutation<
      ColumnResType,
      {
        id: string
        body: UpdateColumnBodyType & { board_id: string; dnd_ordered_cards?: CardType[] }
      }
    >({
      query: ({ id, body }) => ({ url: `${COLUMN_API_URL}/${id}`, method: 'PUT', data: body }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const { board_id } = body

        const updateColumnResult = dispatch(
          boardApi.util.updateQueryData('getBoard', board_id, (draft) => {
            if (draft.result) {
              const columnToUpdate = draft.result.columns?.find((column) => column._id === id)
              const dndOrderedCards = body.dnd_ordered_cards
              const dndOrderedCardsIds = body.card_order_ids

              if (columnToUpdate) {
                if (dndOrderedCards) {
                  columnToUpdate.cards = dndOrderedCards
                }

                if (dndOrderedCardsIds) {
                  columnToUpdate.card_order_ids = dndOrderedCardsIds
                }

                Object.assign(columnToUpdate, body)
              }
            }
          })
        )

        try {
          await queryFulfilled
        } catch (error) {
          // Rollback the optimistic update if the query fails
          updateColumnResult.undo()

          toast.error('There was an error updating the column')
          console.error(error)
        }
      }
    })
  })
})

export const { useAddColumnMutation, useUpdateColumnMutation } = columnApi

const columnApiReducer = columnApi.reducer

export default columnApiReducer
