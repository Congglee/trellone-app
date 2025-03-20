import { z } from 'zod'
import { BoardType, BoardTypeValues } from '~/constants/type'
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

export const CreateBoardBody = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .max(256, { message: 'Description must be at most 256 characters long' })
    .optional(),
  type: z.enum(BoardTypeValues, { message: 'Type must be either public or private' }).default(BoardType.Public)
})

export type CreateBoardBodyType = z.TypeOf<typeof CreateBoardBody>

export const UpdateBoardBody = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .max(256, { message: 'Description must be at most 256 characters long' })
    .optional(),
  type: z.enum(BoardTypeValues, { message: 'Type must be either public or private' }).default(BoardType.Public),
  column_order_ids: z.array(z.string())
})

export type UpdateBoardBodyType = z.TypeOf<typeof UpdateBoardBody>
