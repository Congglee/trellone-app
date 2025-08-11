import z from 'zod'
import {
  BoardInvitationStatusValues,
  BoardRoleValues,
  InvitationTypeValues,
  WorkspaceInvitationStatusValues,
  WorkspaceRoleValues
} from '~/constants/type'
import { BoardSchema } from '~/schemas/board.schema'
import { UserSchema } from '~/schemas/user.schema'

const WorkspaceInvitationSchema = z.object({
  workspace_id: z.string(),
  role: z.enum(WorkspaceRoleValues),
  status: z.enum(WorkspaceInvitationStatusValues)
})

const BoardInvitationSchema = z.object({
  board_id: z.string(),
  workspace_id: z.string(),
  role: z.enum(BoardRoleValues),
  status: z.enum(BoardInvitationStatusValues)
})

export type BoardInvitationType = z.TypeOf<typeof BoardInvitationSchema>

export const InvitationSchema = z.object({
  _id: z.string(),
  inviter_id: z.string(),
  invitee_id: z.string(),
  type: z.enum(InvitationTypeValues),
  board_invitation: BoardInvitationSchema.optional(),
  workspace_invitation: WorkspaceInvitationSchema.optional(),
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

export const VerifyInvitationRes = z.object({
  message: z.string()
})

export type VerifyInvitationResType = z.TypeOf<typeof VerifyInvitationRes>

export const CreateNewWorkspaceInvitationBody = z.object({
  invitee_email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  role: z.enum(WorkspaceRoleValues, { message: 'Workspace role must be either member or admin' })
})

export type CreateNewWorkspaceInvitationBodyType = z.TypeOf<typeof CreateNewWorkspaceInvitationBody>

export const CreateNewBoardInvitationBody = z.object({
  invitee_email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  role: z.enum(BoardRoleValues, { message: 'Board role must be either member or admin' })
})

export type CreateNewBoardInvitationBodyType = z.TypeOf<typeof CreateNewBoardInvitationBody>

export const UpdateWorkspaceInvitationBody = z.object({
  status: z.enum(WorkspaceInvitationStatusValues)
})

export type UpdateWorkspaceInvitationBodyType = z.TypeOf<typeof UpdateWorkspaceInvitationBody>

export const UpdateBoardInvitationBody = z.object({
  status: z.enum(BoardInvitationStatusValues)
})

export type UpdateBoardInvitationBodyType = z.TypeOf<typeof UpdateBoardInvitationBody>

export const UpdateWorkspaceInvitationRes = z.object({
  message: z.string(),
  result: z.object({
    invitation: InvitationSchema,
    invitee: UserSchema
  })
})

export type UpdateWorkspaceInvitationResType = z.TypeOf<typeof UpdateWorkspaceInvitationRes>

export const UpdateBoardInvitationRes = z.object({
  message: z.string(),
  result: z.object({
    invitation: InvitationSchema,
    invitee: UserSchema
  })
})

export type UpdateBoardInvitationResType = z.TypeOf<typeof UpdateBoardInvitationRes>

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
