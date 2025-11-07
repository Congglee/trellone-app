import z from 'zod'
import { WorkspaceRoleValues, WorkspaceVisibility, WorkspaceVisibilityValues } from '~/constants/type'
import { BoardSchema } from '~/schemas/board.schema'
import { UserSchema } from '~/schemas/user.schema'

export const WorkspaceMemberRoleSchema = z.enum(WorkspaceRoleValues)

export type WorkspaceMemberRoleType = z.TypeOf<typeof WorkspaceMemberRoleSchema>

export const WorkspaceMemberSchema = UserSchema.extend({
  user_id: z.string(),
  role: WorkspaceMemberRoleSchema,
  joined_at: z.date(),
  invited_by: z.string().optional()
})

export type WorkspaceMemberType = z.TypeOf<typeof WorkspaceMemberSchema>

export const WorkspaceVisibilitySchema = z.enum(WorkspaceVisibilityValues)

export type WorkspaceVisibilityType = z.TypeOf<typeof WorkspaceVisibilitySchema>

export const WorkspaceSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  visibility: WorkspaceVisibilitySchema,
  logo: z.string().optional(),
  members: z.array(WorkspaceMemberSchema),
  guests: z.union([z.array(UserSchema), z.array(z.string())]),
  boards: z.array(BoardSchema),
  _destroy: z.boolean(),
  created_at: z.date(),
  updated_at: z.date()
})

export const WorkspaceRes = z.object({
  result: WorkspaceSchema,
  message: z.string()
})

export type WorkspaceResType = z.TypeOf<typeof WorkspaceRes>

export const WorkspaceListRes = z.object({
  result: z.object({
    workspaces: z.array(WorkspaceSchema),
    limit: z.number(),
    page: z.number(),
    total_page: z.number()
  }),
  message: z.string()
})

export type WorkspaceListResType = z.TypeOf<typeof WorkspaceListRes>

export const CreateWorkspaceBody = z.object({
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
    .optional()
})

export type CreateWorkspaceBodyType = z.TypeOf<typeof CreateWorkspaceBody>

export const UpdateWorkspaceBody = z.object({
  title: z
    .string()
    .min(1, { message: 'Title must be at least 1 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' })
    .optional(),
  description: z
    .string()
    .refine((val) => val === '' || val.length >= 1, {
      message: 'Description must be at least 1 characters long'
    })
    .refine((val) => val === '' || val.length <= 256, {
      message: 'Description must be at most 256 characters long'
    })
    .optional(),
  visibility: z
    .enum(WorkspaceVisibilityValues, { message: 'Visibility must be either public or private' })
    .default(WorkspaceVisibility.Public)
    .optional(),
  logo: z.string().url().optional()
})

export type UpdateWorkspaceBodyType = z.TypeOf<typeof UpdateWorkspaceBody>

export const EditWorkspaceMemberRoleBody = z.object({
  role: z.enum(WorkspaceRoleValues)
})

export type EditWorkspaceMemberRoleBodyType = z.TypeOf<typeof EditWorkspaceMemberRoleBody>

export const RemoveWorkspaceMemberFromBoardBody = z.object({
  board_id: z.string()
})

export type RemoveWorkspaceMemberFromBoardBodyType = z.TypeOf<typeof RemoveWorkspaceMemberFromBoardBody>

export const RemoveGuestFromBoardBody = z.object({
  board_id: z.string()
})

export type RemoveGuestFromBoardBodyType = z.TypeOf<typeof RemoveGuestFromBoardBody>

export const RemoveGuestFromWorkspaceRes = z.object({
  result: z.object({
    workspace: WorkspaceSchema,
    affected_board_ids: z.array(z.string())
  }),
  message: z.string()
})

export type RemoveGuestFromWorkspaceResType = z.TypeOf<typeof RemoveGuestFromWorkspaceRes>

export const DeleteWorkspaceRes = z.object({
  message: z.string()
})

export type DeleteWorkspaceResType = z.TypeOf<typeof DeleteWorkspaceRes>
