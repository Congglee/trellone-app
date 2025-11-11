import z from 'zod'
import { AttachmentType, CardCommentReactionActionValues } from '~/constants/type'

const CommentReactionSchema = z.object({
  reaction_id: z.string(),
  emoji: z.string(),
  user_id: z.string(),
  user_email: z.string(),
  user_display_name: z.string(),
  reacted_at: z.date()
})

const CommentSchema = z.object({
  comment_id: z.string(),
  user_id: z.string(),
  user_email: z.string(),
  user_avatar: z.string(),
  user_display_name: z.string(),
  content: z.string(),
  commented_at: z.date(),
  reactions: z.array(CommentReactionSchema)
})

export type CommentType = z.TypeOf<typeof CommentSchema>

const CardAttachmentSchema = z.object({
  attachment_id: z.string(),
  type: z.enum([AttachmentType.File, AttachmentType.Link]),
  uploaded_by: z.string(),
  file: z.object({
    url: z.string().url(),
    display_name: z.string().optional(),
    mime_type: z.string(),
    size: z.number(),
    original_name: z.string()
  }),
  link: z.object({
    url: z.string().url(),
    display_name: z.string().optional(),
    favicon_url: z.string().url().optional()
  }),
  added_at: z.date()
})

export type CardAttachmentType = z.TypeOf<typeof CardAttachmentSchema>

export const CardSchema = z.object({
  _id: z.string(),
  board_id: z.string(),
  column_id: z.string(),
  title: z.string(),
  due_date: z.date().nullable().optional(),
  is_completed: z.boolean().nullable().optional(),
  description: z.string().optional(),
  cover_photo: z.string().optional(),
  members: z.array(z.string()).optional(),
  comments: z.array(CommentSchema).optional(),
  attachments: z.array(CardAttachmentSchema).optional(),
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
  due_date: z.date().nullable().optional(),
  is_completed: z.boolean().nullable().optional(),
  description: z.string().optional(),
  cover_photo: z.string().url().optional()
})

export type UpdateCardBodyType = z.TypeOf<typeof UpdateCardBody>

export const AddCardCommentBody = z.object({
  content: z.string()
})

export type AddCardCommentBodyType = z.TypeOf<typeof AddCardCommentBody>

export const UpdateCardCommentBody = z.object({
  content: z.string().optional()
})

export type UpdateCardCommentBodyType = z.TypeOf<typeof UpdateCardCommentBody>

export const AddCardAttachmentBody = z.object({
  type: z.enum([AttachmentType.File, AttachmentType.Link]),
  file: z.object({
    url: z.string().url(),
    display_name: z.string().optional(),
    mime_type: z.string(),
    size: z.number(),
    original_name: z.string()
  }),
  link: z.object({
    url: z.string().url(),
    display_name: z.string().optional(),
    favicon_url: z.string().url().optional()
  })
})

export type AddCardAttachmentBodyType = z.TypeOf<typeof AddCardAttachmentBody>

export const UpdateCardAttachmentBody = z.object({
  type: z.enum([AttachmentType.File, AttachmentType.Link]),
  file: z
    .object({
      url: z.string().url(),
      display_name: z.string().optional(),
      mime_type: z.string(),
      size: z.number(),
      original_name: z.string()
    })
    .optional(),
  link: z
    .object({
      url: z.string().url(),
      display_name: z.string().optional(),
      favicon_url: z.string().url().optional()
    })
    .optional()
})

export type UpdateCardAttachmentBodyType = z.TypeOf<typeof UpdateCardAttachmentBody>

export const AddCardMemberBody = z.object({
  user_id: z.string()
})

export type AddCardMemberBodyType = z.TypeOf<typeof AddCardMemberBody>

export const AddCardLinkAttachmentBody = z.object({
  url: z.string().url({ message: 'Enter a valid URL' }),
  display_name: z.string().optional()
})

export type AddCardLinkAttachmentBodyType = z.TypeOf<typeof AddCardLinkAttachmentBody>

export const UpdateCardLinkAttachmentBody = AddCardLinkAttachmentBody

export type UpdateCardLinkAttachmentBodyType = z.TypeOf<typeof UpdateCardLinkAttachmentBody>

export const UpdateCardFileAttachmentBody = z.object({
  display_name: z.string().optional()
})

export type UpdateCardFileAttachmentBodyType = z.TypeOf<typeof UpdateCardFileAttachmentBody>

export const ReactToCardCommentBody = z.object({
  emoji: z.string().min(1, { message: 'Emoji is required' }).max(2, { message: 'Emoji must be 2 characters long' }),
  action: z.enum(CardCommentReactionActionValues),
  reaction_id: z.string().optional()
})

export type ReactToCardCommentBodyType = z.TypeOf<typeof ReactToCardCommentBody>

export const DeleteCardRes = z.object({
  message: z.string()
})

export type DeleteCardResType = z.TypeOf<typeof DeleteCardRes>

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
