import { combineReducers } from '@reduxjs/toolkit'
import authApiReducer, { authApi } from '~/queries/auth'
import boardApiReducer, { boardApi } from '~/queries/boards'
import cardApiReducer, { cardApi } from '~/queries/cards'
import columnApiReducer, { columnApi } from '~/queries/columns'
import appReducer from '~/store/slices/app.slice'
import authReducer from '~/store/slices/auth.slice'
import boardReducer from '~/store/slices/board.slice'

const rootReducer = combineReducers({
  app: appReducer,
  board: boardReducer,
  auth: authReducer,

  [boardApi.reducerPath]: boardApiReducer,

  [columnApi.reducerPath]: columnApiReducer,

  [cardApi.reducerPath]: cardApiReducer,

  [authApi.reducerPath]: authApiReducer
})

export default rootReducer
