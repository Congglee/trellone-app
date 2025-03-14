import { combineReducers } from '@reduxjs/toolkit'
import boardApiReducer, { boardApi } from '~/queries/boards'
import appReducer from '~/store/slices/app.slice'

const rootReducer = combineReducers({
  app: appReducer,

  [boardApi.reducerPath]: boardApiReducer
})

export default rootReducer
