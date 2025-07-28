import z from 'zod'
import { WorkspaceRoleValues, WorkspaceTypeValues } from '~/constants/type'
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
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' }),
  description: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine((val) => val === undefined || val.length >= 3, {
      message: 'Description must be at least 3 characters long'
    })
    .refine((val) => val === undefined || val.length <= 256, {
      message: 'Description must be at most 256 characters long'
    })
})

export type CreateWorkspaceBodyType = z.TypeOf<typeof CreateWorkspaceBody>
