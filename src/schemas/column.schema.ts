import { z } from 'zod'
import { CardSchema } from '~/schemas/card.schema'

export const ColumnSchema = z.object({
  _id: z.string(),
  board_id: z.string(),

  title: z.string(),
  card_order_ids: z.array(z.string()),

  cards: z.array(CardSchema).optional(),

  _destroy: z.boolean(),

  created_at: z.date(),
  updated_at: z.date()
})

export type ColumnType = z.TypeOf<typeof ColumnSchema>
