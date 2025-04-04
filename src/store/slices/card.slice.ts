import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CardType } from '~/schemas/card.schema'

interface CardSliceState {
  isShowActiveCardModal: boolean
  activeCard: CardType | null
}

const initialState: CardSliceState = {
  isShowActiveCardModal: false,
  activeCard: null
}

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    showActiveCardModal: (state) => {
      state.isShowActiveCardModal = true
    },

    clearAndHideActiveCardModal: (state) => {
      state.isShowActiveCardModal = false
      state.activeCard = null
    },

    updateActiveCard: (state, action: PayloadAction<CardType | null>) => {
      const fullCard = action.payload
      state.activeCard = fullCard
    }
  }
})

export const { showActiveCardModal, clearAndHideActiveCardModal, updateActiveCard } = cardSlice.actions

const cardReducer = cardSlice.reducer

export default cardReducer
