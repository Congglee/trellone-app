import z from 'zod'
import { RoleLevelValues } from '~/constants/type'

export const RoleSchema = z.object({
  _id: z.string(),
  name: z.string(),
  level: z.enum(RoleLevelValues),
  permissions: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date()
})

export type RoleType = z.TypeOf<typeof RoleSchema>
