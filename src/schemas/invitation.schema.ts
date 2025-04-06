import { z } from 'zod'
import { BoardInvitationStatusValues, InvitationTypeValues } from '~/constants/type'

const BoardInvitationSchema = z.object({
  board_id: z.string(),
  status: z.enum(BoardInvitationStatusValues)
})

export type BoardInvitationType = z.TypeOf<typeof BoardInvitationSchema>

export const InvitationSchema = z.object({
  _id: z.string(),
  inviter_id: z.string(),
  invitee_id: z.string(),

  type: z.enum(InvitationTypeValues),
  board_invitation: BoardInvitationSchema.optional(),

  _destroy: z.boolean(),

  created_at: z.date(),
  updated_at: z.date()
})

export type InvitationType = z.TypeOf<typeof InvitationSchema>

export const InvitationRes = z.object({
  result: InvitationSchema,
  message: z.string()
})

export type InvitationResType = z.TypeOf<typeof InvitationRes>

export const CreateNewBoardInvitationBody = z.object({
  invitee_email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' })
})

export type CreateNewBoardInvitationBodyType = z.TypeOf<typeof CreateNewBoardInvitationBody>
