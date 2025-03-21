import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { ColumnResType, CreateColumnBodyType, UpdateColumnBodyType } from '~/schemas/column.schema'

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
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || 'Column added successfully')
        } catch (error) {
          toast.error('There was an error adding the column')
          console.error(error)
        }
      }
    }),

    updateColumn: build.mutation<ColumnResType, { id: string; body: UpdateColumnBodyType }>({
      query: ({ id, body }) => ({ url: `${COLUMN_API_URL}/${id}`, method: 'PUT', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
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
