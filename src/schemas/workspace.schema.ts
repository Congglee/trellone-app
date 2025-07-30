import z from 'zod'
import { WorkspaceRoleValues, WorkspaceType, WorkspaceTypeValues } from '~/constants/type'
import { BoardSchema } from '~/schemas/board.schema'
import { UserSchema } from '~/schemas/user.schema'

export const WorkspaceMemberSchema = UserSchema.extend({
  role: z.enum(WorkspaceRoleValues),
  joined_at: z.date(),
  invited_by: z.string().optional()
})

export const WorkspaceSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(WorkspaceTypeValues),
  logo: z.string().optional(),
  members: z.array(WorkspaceMemberSchema),
  guests: z.array(UserSchema),
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
  type: z
    .enum(WorkspaceTypeValues, { message: 'Type must be either public or private' })
    .default(WorkspaceType.Public)
    .optional(),
  logo: z.string().url().optional()
})

export type UpdateWorkspaceBodyType = z.TypeOf<typeof UpdateWorkspaceBody>
