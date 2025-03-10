import { Column } from '~/types/column.type'

type BoardType = 'public' | 'private'

export interface Board {
  _id: string
  title: string
  description?: string
  type: BoardType
  cover_photo?: string

  workspace_id: string
  column_order_ids: string[]

  owners: string[]
  members: string[]

  columns?: Column[]

  _destroy: boolean
  created_at: string
  updated_at: string
}
