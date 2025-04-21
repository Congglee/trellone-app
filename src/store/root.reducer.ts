import { combineReducers } from '@reduxjs/toolkit'
import authApiReducer, { authApi } from '~/queries/auth'
import boardApiReducer, { boardApi } from '~/queries/boards'
import cardApiReducer, { cardApi } from '~/queries/cards'
import columnApiReducer, { columnApi } from '~/queries/columns'
import invitationApiReducer, { invitationApi } from '~/queries/invitations'
import mediaApiReducer, { mediaApi } from '~/queries/medias'
import userApiReducer, { userApi } from '~/queries/users'
import appReducer from '~/store/slices/app.slice'
import authReducer from '~/store/slices/auth.slice'
import boardReducer from '~/store/slices/board.slice'
import cardReducer from '~/store/slices/card.slice'
import notificationReducer from '~/store/slices/notification.slice'

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  board: boardReducer,
  card: cardReducer,
  notification: notificationReducer,

  [authApi.reducerPath]: authApiReducer,
  [userApi.reducerPath]: userApiReducer,
  [boardApi.reducerPath]: boardApiReducer,
  [columnApi.reducerPath]: columnApiReducer,
  [cardApi.reducerPath]: cardApiReducer,
  [mediaApi.reducerPath]: mediaApiReducer,
  [invitationApi.reducerPath]: invitationApiReducer
})

export default rootReducer
