import z from 'zod'
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

export const UploadDocumentRes = z.object({
  result: z.array(
    z.object({
      url: z.string(),
      type: z.nativeEnum(MediaType),
      mime_type: z.string(),
      size: z.number(),
      original_name: z.string()
    })
  )
})

export type UploadDocumentResType = z.TypeOf<typeof UploadDocumentRes>

export const UnsplashImageUrlSchema = z.object({
  url: z.string(),
  full: z.string(),
  regular: z.string(),
  small: z.string(),
  thumb: z.string(),
  small_s3: z.string()
})

export type UnsplashImageUrlType = z.TypeOf<typeof UnsplashImageUrlSchema>

export const UnsplashSearchPhotos = z.object({
  result: z.array(
    z.object({
      id: z.string(),
      urls: UnsplashImageUrlSchema,
      description: z.string()
    })
  ),
  message: z.string()
})

export type UnsplashSearchPhotosType = z.TypeOf<typeof UnsplashSearchPhotos>
