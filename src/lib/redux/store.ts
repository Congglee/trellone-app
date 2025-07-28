import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authApi } from '~/queries/auth'
import { boardApi } from '~/queries/boards'
import { cardApi } from '~/queries/cards'
import { columnApi } from '~/queries/columns'
import { invitationApi } from '~/queries/invitations'
import { mediaApi } from '~/queries/medias'
import { userApi } from '~/queries/users'
import { workspaceApi } from '~/queries/workspaces'
import rootReducer from '~/store/root.reducer'

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
  // blacklist: [],
}

const persistedReducers = persistReducer(rootPersistConfig, rootReducer)

const apiMiddlewares = [
  workspaceApi.middleware,
  boardApi.middleware,
  columnApi.middleware,
  cardApi.middleware,
  authApi.middleware,
  userApi.middleware,
  mediaApi.middleware,
  invitationApi.middleware
]

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(apiMiddlewares),
  devTools: process.env.NODE_ENV !== 'production'
})

export const persistor = persistStore(store)

export type AppStore = typeof store

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
