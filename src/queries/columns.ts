import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { boardApi } from '~/queries/boards'
import { ColumnResType, CreateColumnBodyType } from '~/schemas/column.schema'
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
              if (draft?.result) {
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
    })
  })
})

export const { useAddColumnMutation } = columnApi

const columnApiReducer = columnApi.reducer

export default columnApiReducer
