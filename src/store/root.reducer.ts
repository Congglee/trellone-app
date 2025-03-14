import { combineReducers } from '@reduxjs/toolkit'
import appReducer from '~/store/slices/app.slice'

const rootReducer = combineReducers({
  app: appReducer
})

export default rootReducer
