import { combineReducers } from '@reduxjs/toolkit'
import boardApiReducer, { boardApi } from '~/queries/boards'
import columnApiReducer, { columnApi } from '~/queries/columns'
import appReducer from '~/store/slices/app.slice'

const rootReducer = combineReducers({
  app: appReducer,

  [boardApi.reducerPath]: boardApiReducer,

  [columnApi.reducerPath]: columnApiReducer
})

export default rootReducer
