export type Mode = 'light' | 'dark' | 'system'

type EntityValidationErrors<T = Record<string, any>> = {
  message: string
  errors?: {
    [K in keyof T]?: {
      type: string
      value: string
      msg: string
      path: string
      location: string
    }
  }
}

export interface EntityError<T = Record<string, any>> {
  status: number
  data: EntityValidationErrors<T>
}

export interface SiteConfig {
  name: string
  author: string
  description: string
  keywords: Array<string>
  url: {
    base: string
    author: string
  }
  links: {
    github: string
  }
  ogImage: string
}
