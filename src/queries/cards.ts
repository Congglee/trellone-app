import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import {
  AddCardAttachmentBodyType,
  AddCardCommentBodyType,
  AddCardMemberBodyType,
  CardResType,
  CreateCardBodyType,
  DeleteCardResType,
  MoveCardToDifferentColumnBodyType,
  MoveCardToDifferentColumnResType,
  ReactToCardCommentBodyType,
  UpdateCardAttachmentBodyType,
  UpdateCardBodyType,
  UpdateCardCommentBodyType
} from '~/schemas/card.schema'

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
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || 'Card added successfully')
        } catch (error) {
          toast.error('There was an error adding the card')
          console.error(error)
        }
      }
    }),

    updateCard: build.mutation<CardResType, { id: string; body: UpdateCardBodyType }>({
      query: ({ id, body }) => ({ url: `${CARD_API_URL}/${id}`, method: 'PUT', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error updating the card')
          console.error(error)
        }
      }
    }),

    archiveCard: build.mutation<CardResType, { card_id: string }>({
      query: ({ card_id }) => ({ url: `${CARD_API_URL}/${card_id}/archive`, method: 'PATCH' }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error archiving the card')
          console.error(error)
        }
      }
    }),

    reopenCard: build.mutation<CardResType, { card_id: string }>({
      query: ({ card_id }) => ({ url: `${CARD_API_URL}/${card_id}/reopen`, method: 'PATCH' }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error reopening the card')
          console.error(error)
        }
      }
    }),

    addCardComment: build.mutation<CardResType, { card_id: string; body: AddCardCommentBodyType }>({
      query: ({ card_id, body }) => ({ url: `${CARD_API_URL}/${card_id}/comments`, method: 'POST', data: body })
    }),

    updateCardComment: build.mutation<
      CardResType,
      { card_id: string; comment_id: string; body: UpdateCardCommentBodyType }
    >({
      query: ({ card_id, comment_id, body }) => ({
        url: `${CARD_API_URL}/${card_id}/comments/${comment_id}`,
        method: 'PUT',
        data: body
      })
    }),

    removeCardComment: build.mutation<CardResType, { card_id: string; comment_id: string }>({
      query: ({ card_id, comment_id }) => ({
        url: `${CARD_API_URL}/${card_id}/comments/${comment_id}`,
        method: 'DELETE'
      })
    }),

    addCardAttachment: build.mutation<CardResType, { card_id: string; body: AddCardAttachmentBodyType }>({
      query: ({ card_id, body }) => ({ url: `${CARD_API_URL}/${card_id}/attachments`, method: 'POST', data: body })
    }),

    updateCardAttachment: build.mutation<
      CardResType,
      { card_id: string; attachment_id: string; body: UpdateCardAttachmentBodyType }
    >({
      query: ({ card_id, attachment_id, body }) => ({
        url: `${CARD_API_URL}/${card_id}/attachments/${attachment_id}`,
        method: 'PUT',
        data: body
      })
    }),

    removeCardAttachment: build.mutation<CardResType, { card_id: string; attachment_id: string }>({
      query: ({ card_id, attachment_id }) => ({
        url: `${CARD_API_URL}/${card_id}/attachments/${attachment_id}`,
        method: 'DELETE'
      })
    }),

    addCardMember: build.mutation<CardResType, { card_id: string; body: AddCardMemberBodyType }>({
      query: ({ card_id, body }) => ({ url: `${CARD_API_URL}/${card_id}/members`, method: 'POST', data: body })
    }),

    removeCardMember: build.mutation<CardResType, { card_id: string; user_id: string }>({
      query: ({ card_id, user_id }) => ({
        url: `${CARD_API_URL}/${card_id}/members/${user_id}`,
        method: 'DELETE'
      })
    }),

    reactToCardComment: build.mutation<
      CardResType,
      { card_id: string; comment_id: string; body: ReactToCardCommentBodyType }
    >({
      query: ({ card_id, comment_id, body }) => ({
        url: `${CARD_API_URL}/${card_id}/comments/${comment_id}/reaction`,
        method: 'PUT',
        data: body
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error reacting to the comment')
          console.error(error)
        }
      }
    }),

    deleteCard: build.mutation<DeleteCardResType, string>({
      query: (id) => ({ url: `${CARD_API_URL}/${id}`, method: 'DELETE' }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || 'Card deleted successfully')
        } catch (error) {
          toast.error('There was an error deleting the card')
          console.error(error)
        }
      }
    }),

    moveCardToDifferentColumn: build.mutation<MoveCardToDifferentColumnResType, MoveCardToDifferentColumnBodyType>({
      query: (body) => ({ url: `${CARD_API_URL}/supports/moving-card`, method: 'PUT', data: body }),
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

export const {
  useAddCardMutation,
  useUpdateCardMutation,
  useArchiveCardMutation,
  useReopenCardMutation,
  useAddCardCommentMutation,
  useUpdateCardCommentMutation,
  useRemoveCardCommentMutation,
  useAddCardAttachmentMutation,
  useUpdateCardAttachmentMutation,
  useRemoveCardAttachmentMutation,
  useAddCardMemberMutation,
  useRemoveCardMemberMutation,
  useReactToCardCommentMutation,
  useDeleteCardMutation,
  useMoveCardToDifferentColumnMutation
} = cardApi

export const cardApiReducer = cardApi.reducer

export default cardApiReducer
