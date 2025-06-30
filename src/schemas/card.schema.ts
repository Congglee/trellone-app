import z from 'zod'
import {
  AttachmentType,
  CardAttachmentActionValues,
  CardCommentReactionActionValues,
  CardMemberAction,
  CommentActionValues
} from '~/constants/type'

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

const CommentPayloadSchema = z.object({
  action: z.enum(CommentActionValues),
  user_email: z.string(),
  user_avatar: z.string().optional(),
  user_display_name: z.string(),
  content: z.string()
})

export type CommentPayloadType = z.TypeOf<typeof CommentPayloadSchema>

const CardMemberPayloadSchema = z.object({
  action: z.enum([CardMemberAction.Add, CardMemberAction.Remove]),
  user_id: z.string()
})

export type CardMemberPayloadType = z.TypeOf<typeof CardMemberPayloadSchema>

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

const CardAttachmentPayloadSchema = z.object({
  action: z.enum(CardAttachmentActionValues),
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

export type CardAttachmentPayloadType = z.TypeOf<typeof CardAttachmentPayloadSchema>

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
  cover_photo: z.string().url().optional(),
  _destroy: z.boolean().optional(),
  comment: CommentPayloadSchema.optional(),
  member: CardMemberPayloadSchema.optional(),
  attachment: CardAttachmentPayloadSchema.optional()
})

export type UpdateCardBodyType = z.TypeOf<typeof UpdateCardBody>

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
