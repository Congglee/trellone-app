import { z } from 'zod'
import { BoardInvitationStatusValues, InvitationTypeValues } from '~/constants/type'
import { BoardSchema } from '~/schemas/board.schema'
import { UserSchema } from '~/schemas/user.schema'

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

  inviter: UserSchema,
  invitee: UserSchema,
  board: BoardSchema,

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

export const VerifyBoardInvitationRes = z.object({
  message: z.string()
})

export type VerifyBoardInvitationResType = z.TypeOf<typeof VerifyBoardInvitationRes>

export const CreateNewBoardInvitationBody = z.object({
  invitee_email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' })
})

export type CreateNewBoardInvitationBodyType = z.TypeOf<typeof CreateNewBoardInvitationBody>

export const UpdateBoardInvitationBody = z.object({
  status: z.enum(BoardInvitationStatusValues)
})

export type UpdateBoardInvitationBodyType = z.TypeOf<typeof UpdateBoardInvitationBody>

export const InvitationListRes = z.object({
  result: z.object({
    invitations: z.array(InvitationSchema),
    limit: z.number(),
    page: z.number(),
    total_page: z.number()
  }),
  message: z.string()
})

export type InvitationListResType = z.TypeOf<typeof InvitationListRes>
