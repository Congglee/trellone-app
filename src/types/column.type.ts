import { Card } from '~/types/card.type'

export interface Column {
  _id: string
  board_id: string
  title: string
  card_order_ids: string[]
  cards?: Card[]
  _destroy: boolean
  created_at: string
  updated_at: string
}
