import { z } from 'zod'
import { BoardTypeValues } from '~/constants/type'
import { ColumnSchema } from '~/schemas/column.schema'

export const BoardSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(BoardTypeValues),
  cover_photo: z.string().optional(),

  workspace_id: z.string(),
  column_order_ids: z.array(z.string()),

  owners: z.array(z.string()),
  members: z.array(z.string()),

  columns: z.array(ColumnSchema).optional(),

  _destroy: z.boolean(),

  created_at: z.date(),
  updated_at: z.date()
})

export const BoardRes = z.object({
  result: BoardSchema,
  message: z.string()
})

export type BoardResType = z.TypeOf<typeof BoardRes>
