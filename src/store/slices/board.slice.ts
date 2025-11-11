import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import isEmpty from 'lodash/isEmpty'
import { envConfig } from '~/constants/config'
import http from '~/lib/http'
import { BoardResType, BoardType } from '~/schemas/board.schema'
import { CardType } from '~/schemas/card.schema'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/utils'

interface BoardSliceState {
  activeBoard: BoardType | null
  loading: string
  currentRequestId: string | undefined
  error: string | null
  boardDrawerOpen: boolean
}

const initialState: BoardSliceState = {
  activeBoard: null,
  loading: 'idle',
  currentRequestId: undefined,
  error: null,
  boardDrawerOpen: false
}

export const getBoardDetails = createAsyncThunk('board/getBoardDetails', async (boardId: string, thunkAPI) => {
  // Clear the active board when starting a new request
  thunkAPI.dispatch(boardSlice.actions.clearActiveBoard())

  const response = await http.get<BoardResType>(`${envConfig.baseUrl}/boards/${boardId}`, { signal: thunkAPI.signal })

  return response.data
})

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateActiveBoard: (state, action: PayloadAction<BoardType | null>) => {
      const board = action.payload
      state.activeBoard = board
    },

    setBoardDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.boardDrawerOpen = action.payload
    },

    clearActiveBoard: (state) => {
      state.activeBoard = null
      state.error = null
    },

    updateCardInBoard: (state, action: PayloadAction<CardType>) => {
      const incomingCard = action.payload

      const column = state.activeBoard?.columns?.find((col) => col._id === incomingCard?.column_id)

      if (column) {
        const card = column.cards?.find((item) => item._id === incomingCard._id)

        if (card) {
          Object.keys(incomingCard).forEach((key) => {
            ;(card as Record<string, any>)[key] = incomingCard[key as keyof CardType]
          })
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoardDetails.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
          state.error = null
        }
      })
      .addCase(getBoardDetails.fulfilled, (state, action) => {
        const { requestId } = action.meta

        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle'

          let board = action.payload.result

          board.columns = mapOrder(board.columns, board.column_order_ids, '_id')

          board.columns.forEach((column) => {
            if (isEmpty(column.cards)) {
              column.cards = [generatePlaceholderCard(column)]
              column.card_order_ids = [generatePlaceholderCard(column)._id]
            } else {
              column.cards = mapOrder(column.cards, column.card_order_ids, '_id')
            }
          })

          state.activeBoard = board
          state.currentRequestId = undefined
          state.error = null
        }
      })
      .addCase(getBoardDetails.rejected, (state, action) => {
        const { requestId } = action.meta

        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle'
          state.activeBoard = null
          state.currentRequestId = undefined
          state.error = action.error.message || 'Failed to load board'
        }
      })
  }
})

export const { updateActiveBoard, updateCardInBoard, clearActiveBoard, setBoardDrawerOpen } = boardSlice.actions

const boardReducer = boardSlice.reducer

export default boardReducer
