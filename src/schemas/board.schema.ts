import z from 'zod'
import { BoardRoleValues, BoardType, BoardTypeValues, WorkspaceRoleValues } from '~/constants/type'
import { ColumnSchema } from '~/schemas/column.schema'
import { UserSchema } from '~/schemas/user.schema'

export const BoardMemberRoleSchema = z.enum(BoardRoleValues)

export type BoardMemberRoleType = z.TypeOf<typeof BoardMemberRoleSchema>

export const BoardMemberSchema = UserSchema.extend({
  user_id: z.string(),
  role: BoardMemberRoleSchema,
  joined_at: z.date(),
  invited_by: z.string().optional()
})

export type BoardMemberType = z.TypeOf<typeof BoardMemberSchema>

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
  workspace: z.object({
    _id: z.string(),
    title: z.string(),
    logo: z.string().optional(),
    boards: z.array(
      z.object({
        _id: z.string(),
        title: z.string(),
        cover_photo: z.string().optional()
      })
    ),
    members: z.array(
      z.object({
        user_id: z.string(),
        role: z.enum(WorkspaceRoleValues),
        joined_at: z.date(),
        invited_by: z.string().optional()
      })
    ),
    guests: z.array(z.string())
  }),
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
  cover_photo: z.string().url().optional(),
  _destroy: z.boolean().optional()
})

export type UpdateBoardBodyType = z.TypeOf<typeof UpdateBoardBody>

export const DeleteBoardRes = z.object({
  message: z.string()
})

export type DeleteBoardResType = z.TypeOf<typeof DeleteBoardRes>
