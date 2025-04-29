import { createSlice } from '@reduxjs/toolkit'
import { Socket } from 'socket.io-client'

interface AppSliceState {
  socket: Socket | null
}

const initialState: AppSliceState = {
  socket: null
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload
    },

    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect()
        state.socket = null
      }
    }
  }
})

export const { setSocket, disconnectSocket } = appSlice.actions

const appReducer = appSlice.reducer

export default appReducer
