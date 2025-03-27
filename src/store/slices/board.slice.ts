import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { envConfig } from '~/constants/config'
import http from '~/lib/http'
import { BoardResType } from '~/schemas/board.schema'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/utils'

interface BoardSliceState {
  activeBoard: BoardResType['result'] | null
  loading: string
  currentRequestId: string | undefined
}

const initialState: BoardSliceState = {
  activeBoard: null,
  loading: 'idle',
  currentRequestId: undefined
}

export const getBoardDetails = createAsyncThunk('board/getBoardDetails', async (boardId: string, thunkAPI) => {
  const response = await http.get<BoardResType>(`${envConfig.baseUrl}/boards/${boardId}`, { signal: thunkAPI.signal })
  return response.data
})

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateActiveBoard: (state, action: PayloadAction<BoardResType['result'] | null>) => {
      const board = action.payload
      state.activeBoard = board
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoardDetails.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
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
        }
      })
      .addCase(getBoardDetails.rejected, (state, action) => {
        const { requestId } = action.meta

        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle'
          state.currentRequestId = undefined
        }
      })
  }
})

export const { updateActiveBoard } = boardSlice.actions

const boardReducer = boardSlice.reducer

export default boardReducer
