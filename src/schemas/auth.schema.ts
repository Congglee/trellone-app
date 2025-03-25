import { z } from 'zod'

export const LoginBody = z
  .object({
    email: z.string().min(1, { message: 'Email is required' }).email({
      message: 'Invalid email'
    }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be at most 100 characters')
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const RegisterBody = z
  .object({
    email: z.string().min(1, { message: 'Email is required' }).email({
      message: 'Invalid email'
    }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be at most 100 characters'),
    confirm_password: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
      .max(100, 'Confirm password must be at most 100 characters')
  })
  .strict()
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirm_password']
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const AuthRes = z.object({
  result: z.object({
    access_token: z.string(),
    refresh_token: z.string()
  }),
  message: z.string()
})

export type AuthResType = z.TypeOf<typeof AuthRes>

export const LogoutRes = z.object({
  message: z.string()
})

export type LogoutResType = z.TypeOf<typeof LogoutRes>
