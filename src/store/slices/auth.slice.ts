import { createSlice } from '@reduxjs/toolkit'

interface AuthSliceState {
  // profile: UserType | null
  isAuthenticated: boolean
}

const initialState: AuthSliceState = {
  // profile: null,
  isAuthenticated: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    }
  }
})

export const { setAuthenticated } = authSlice.actions

const authReducer = authSlice.reducer

export default authReducer
