import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authApiReducer, { authApi } from '~/queries/auth'
import boardApiReducer, { boardApi } from '~/queries/boards'
import cardApiReducer, { cardApi } from '~/queries/cards'
import columnApiReducer, { columnApi } from '~/queries/columns'
import invitationApiReducer, { invitationApi } from '~/queries/invitations'
import mediaApiReducer, { mediaApi } from '~/queries/medias'
import userApiReducer, { userApi } from '~/queries/users'
import workspaceApiReducer, { workspaceApi } from '~/queries/workspaces'
import appReducer from '~/store/slices/app.slice'
import authReducer from '~/store/slices/auth.slice'
import boardReducer from '~/store/slices/board.slice'
import cardReducer from '~/store/slices/card.slice'
import notificationReducer from '~/store/slices/notification.slice'
import workspaceReducer from '~/store/slices/workspace.slice'

// Persist only specific UI flags per slice
const boardPersistConfig = {
  key: 'board',
  storage,
  whitelist: ['boardDrawerOpen']
}

const workspacePersistConfig = {
  key: 'workspace',
  storage,
  whitelist: ['workspaceDrawerOpen']
}

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  board: persistReducer(boardPersistConfig, boardReducer),
  card: cardReducer,
  notification: notificationReducer,
  workspace: persistReducer(workspacePersistConfig, workspaceReducer),

  [authApi.reducerPath]: authApiReducer,
  [userApi.reducerPath]: userApiReducer,
  [workspaceApi.reducerPath]: workspaceApiReducer,
  [boardApi.reducerPath]: boardApiReducer,
  [columnApi.reducerPath]: columnApiReducer,
  [cardApi.reducerPath]: cardApiReducer,
  [mediaApi.reducerPath]: mediaApiReducer,
  [invitationApi.reducerPath]: invitationApiReducer
})

export default rootReducer
