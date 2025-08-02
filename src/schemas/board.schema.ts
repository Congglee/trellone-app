import z from 'zod'
import { BoardRoleValues, BoardType, BoardTypeValues } from '~/constants/type'
import { ColumnSchema } from '~/schemas/column.schema'
import { UserSchema } from '~/schemas/user.schema'

export const BoardMemberSchema = UserSchema.extend({
  user_id: z.string(),
  role: z.enum(BoardRoleValues),
  joined_at: z.date(),
  invited_by: z.string().optional()
})

export const BoardSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(BoardTypeValues),
  cover_photo: z.string().optional(),
  workspace_id: z.string(),
  column_order_ids: z.array(z.string()),
  members: z.array(BoardMemberSchema),
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

export const BoardListRes = z.object({
  result: z.object({
    boards: z.array(BoardSchema),
    limit: z.number(),
    page: z.number(),
    total_page: z.number()
  }),
  message: z.string()
})

export type BoardListResType = z.TypeOf<typeof BoardListRes>

export const CreateBoardBody = z.object({
  title: z
    .string()
    .min(1, { message: 'Title must be at least 1 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' }),
  description: z
    .string()
    .refine((val) => val === '' || val.length >= 1, {
      message: 'Description must be at least 1 characters long'
    })
    .refine((val) => val === '' || val.length <= 256, {
      message: 'Description must be at most 256 characters long'
    })
    .optional(),
  type: z.enum(BoardTypeValues, { message: 'Type must be either public or private' }).default(BoardType.Public),
  workspace_id: z.string().min(1, { message: 'Please select a workspace' })
})

export type CreateBoardBodyType = z.TypeOf<typeof CreateBoardBody>

export const UpdateBoardBody = z.object({
  title: z
    .string()
    .min(1, { message: 'Title must be at least 1 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' })
    .optional(),
  description: z
    .string()
    .min(1, { message: 'Description must be at least 1 characters long' })
    .max(256, { message: 'Description must be at most 256 characters long' })
    .optional(),
  type: z
    .enum(BoardTypeValues, { message: 'Type must be either public or private' })
    .default(BoardType.Public)
    .optional(),
  column_order_ids: z.array(z.string()).optional(),
  cover_photo: z.string().url().optional()
})

export type UpdateBoardBodyType = z.TypeOf<typeof UpdateBoardBody>

export const MoveCardToDifferentColumnBody = z.object({
  current_card_id: z.string(),
  prev_column_id: z.string(),
  prev_card_order_ids: z.array(z.string()),
  next_column_id: z.string(),
  next_card_order_ids: z.array(z.string())
})

export type MoveCardToDifferentColumnBodyType = z.TypeOf<typeof MoveCardToDifferentColumnBody>

export const MoveCardToDifferentColumnRes = z.object({
  message: z.string()
})

export type MoveCardToDifferentColumnResType = z.TypeOf<typeof MoveCardToDifferentColumnRes>
