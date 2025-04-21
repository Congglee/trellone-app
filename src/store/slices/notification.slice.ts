import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InvitationType } from '~/schemas/invitation.schema'

interface NotificationSliceState {
  notifications: InvitationType[]
}

const initialState: NotificationSliceState = {
  notifications: []
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<InvitationType[]>) => {
      state.notifications = action.payload
    },

    addNotification: (state, action: PayloadAction<InvitationType>) => {
      const incomingInvitation = action.payload
      state.notifications.unshift(incomingInvitation)
    }
  }
})

export const { setNotifications, addNotification } = notificationSlice.actions

const notificationReducer = notificationSlice.reducer

export default notificationReducer
