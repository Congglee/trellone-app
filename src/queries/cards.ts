import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { boardApi } from '~/queries/boards'
import { CardResType, CreateCardBodyType } from '~/schemas/card.schema'

const CARD_API_URL = '/cards' as const

const reducerPath = 'card/api' as const
const tagTypes = ['Card'] as const

export const cardApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    addCard: build.mutation<CardResType, CreateCardBodyType>({
      query: (body) => ({ url: CARD_API_URL, method: 'POST', data: body }),
      async onQueryStarted({ board_id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || 'Card added successfully')

          // Optimistically update the board's columns and cards in the cache
          dispatch(
            boardApi.util.updateQueryData('getBoard', board_id, (draft) => {
              if (draft?.result) {
                const newCard = data.result
                const columnToUpdate = draft.result.columns?.find((column) => column._id === newCard.column_id)

                // If the column exists, add the new card to it
                if (columnToUpdate) {
                  if (!columnToUpdate.cards) {
                    columnToUpdate.cards = []
                  }

                  // Add the new card to the column's cards
                  columnToUpdate.cards.push(newCard)

                  // Update card_order_ids if it exists
                  if (columnToUpdate.card_order_ids) {
                    columnToUpdate.card_order_ids.push(newCard._id)
                  }
                }
              }
            })
          )
        } catch (error) {
          toast.error('There was an error adding the card')
          console.error(error)
        }
      }
    })
  })
})

export const { useAddCardMutation } = cardApi

export const cardApiReducer = cardApi.reducer

export default cardApiReducer
