import { z } from 'zod'

const CommentSchema = z.object({
  user_id: z.string(),
  user_email: z.string(),
  user_avatar: z.string(),
  user_display_name: z.string(),
  content: z.string(),
  commented_at: z.date()
})

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
