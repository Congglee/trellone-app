import { combineReducers } from '@reduxjs/toolkit'
import boardApiReducer, { boardApi } from '~/queries/boards'
import cardApiReducer, { cardApi } from '~/queries/cards'
import columnApiReducer, { columnApi } from '~/queries/columns'
import appReducer from '~/store/slices/app.slice'
import boardReducer from '~/store/slices/board.slice'

const rootReducer = combineReducers({
  app: appReducer,
  board: boardReducer,

  [boardApi.reducerPath]: boardApiReducer,

  [columnApi.reducerPath]: columnApiReducer,

  [cardApi.reducerPath]: cardApiReducer
})

export default rootReducer
