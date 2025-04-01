import { z } from 'zod'
import { MediaType } from '~/constants/type'

export const UploadImageRes = z.object({
  result: z.array(
    z.object({
      url: z.string(),
      type: z.nativeEnum(MediaType)
    })
  ),
  message: z.string()
})

export type UploadImageResType = z.TypeOf<typeof UploadImageRes>
