import { z } from 'zod'
import { CardMemberAction } from '~/constants/type'

const CommentSchema = z.object({
  user_id: z.string(),
  user_email: z.string(),
  user_avatar: z.string(),
  user_display_name: z.string(),
  content: z.string(),
  commented_at: z.date()
})

export type CommentType = z.TypeOf<typeof CommentSchema>

const CardMemberPayloadSchema = z.object({
  action: z.enum([CardMemberAction.Add, CardMemberAction.Remove]),
  user_id: z.string()
})

export type CardMemberPayloadType = z.TypeOf<typeof CardMemberPayloadSchema>

export const CardSchema = z.object({
  _id: z.string(),
  board_id: z.string(),
  column_id: z.string(),

  title: z.string(),
  description: z.string().optional(),
  cover_photo: z.string().optional(),

  members: z.array(z.string()).optional(),
  comments: z.array(CommentSchema),
  attachments: z.array(z.string()).optional(),

  _destroy: z.boolean(),

  created_at: z.date(),
  updated_at: z.date(),

  FE_PlaceholderCard: z.boolean().optional()
})

export type CardType = z.TypeOf<typeof CardSchema>

export const CardRes = z.object({
  result: CardSchema,
  message: z.string()
})

export type CardResType = z.TypeOf<typeof CardRes>

export const CreateCardBody = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' }),
  board_id: z.string().min(1, { message: 'Board ID is required' }),
  column_id: z.string().min(1, { message: 'Column ID is required' })
})

export type CreateCardBodyType = z.TypeOf<typeof CreateCardBody>

export const UpdateCardBody = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' })
    .optional(),
  description: z.string().optional(),
  cover_photo: z.string().url().optional(),
  comment: CommentSchema.optional(),
  member: CardMemberPayloadSchema.optional()
})

export type UpdateCardBodyType = z.TypeOf<typeof UpdateCardBody>
