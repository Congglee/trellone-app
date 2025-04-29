import { createSlice } from '@reduxjs/toolkit'
import { UserType } from '~/schemas/user.schema'

interface AuthSliceState {
  isAuthenticated: boolean
  profile: UserType | null
}

const initialState: AuthSliceState = {
  profile: null,
  isAuthenticated: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },

    setProfile: (state, action) => {
      state.profile = action.payload
    },

    reset: (state) => {
      state.isAuthenticated = false
      state.profile = null
    }
  }
})

export const { setAuthenticated, setProfile, reset } = authSlice.actions

const authReducer = authSlice.reducer

export default authReducer
