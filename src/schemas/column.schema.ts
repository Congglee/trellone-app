import z from 'zod'
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

export const ColumnRes = z.object({
  result: ColumnSchema,
  message: z.string()
})

export type ColumnResType = z.TypeOf<typeof ColumnRes>

export const CreateColumnBody = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' }),
  board_id: z.string().min(1, { message: 'Board ID is required' })
})

export type CreateColumnBodyType = z.TypeOf<typeof CreateColumnBody>

export const UpdateColumnBody = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' })
    .optional(),
  card_order_ids: z.array(z.string()).optional()
})

export type UpdateColumnBodyType = z.TypeOf<typeof UpdateColumnBody>

export const DeleteColumnRes = z.object({
  message: z.string()
})

export type DeleteColumnResType = z.TypeOf<typeof DeleteColumnRes>
