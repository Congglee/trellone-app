import z from 'zod'
import { Role, UserVerifyStatus } from '~/constants/type'

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string(),
  username: z.string(),
  display_name: z.string(),
  avatar: z.string().optional(),
  role: z.enum([Role.Client, Role.Admin]),
  is_active: z.boolean(),
  verify: z.nativeEnum(UserVerifyStatus),
  _destroy: z.boolean(),
  created_at: z.date(),
  updated_at: z.date()
})

export type UserType = z.TypeOf<typeof UserSchema>

export const UserRes = z.object({
  result: UserSchema,
  message: z.string()
})

export type UserResType = z.TypeOf<typeof UserRes>

export const UpdateMeBody = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters'),
  avatar: z.string().url().optional()
})

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>

export const ChangePasswordBody = z
  .object({
    old_password: z
      .string()
      .min(6, 'Old password must be at least 6 characters')
      .max(50, 'Old password must be at most 50 characters')
      .regex(/[a-z]/, { message: 'Old password must contain at least 1 lowercase letter' })
      .regex(/[A-Z]/, { message: 'Old password must contain at least 1 uppercase letter' })
      .regex(/[0-9]/, { message: 'Old password must contain at least 1 number' })
      .regex(/[^a-zA-Z0-9]/, { message: 'Old password must contain at least 1 symbol' }),
    password: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(50, 'New password must be at most 50 characters')
      .regex(/[a-z]/, { message: 'New password must contain at least 1 lowercase letter' })
      .regex(/[A-Z]/, { message: 'New password must contain at least 1 uppercase letter' })
      .regex(/[0-9]/, { message: 'New password must contain at least 1 number' })
      .regex(/[^a-zA-Z0-9]/, { message: 'New password must contain at least 1 symbol' }),
    confirm_password: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
      .max(50, 'Confirm password must be at most 50 characters')
  })
  .strict()
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: 'custom',
        message: "New passwords don't match",
        path: ['confirm_password']
      })
    }
  })

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>

export const ChangePasswordRes = z.object({
  message: z.string()
})

export type ChangePasswordResType = z.TypeOf<typeof ChangePasswordRes>
