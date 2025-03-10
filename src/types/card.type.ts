interface Comment {
  user_id: string
  user_email: string
  user_avatar: string
  user_display_name: string
  content: string
  commented_at: string
}

export interface Card {
  _id: string
  board_id: string
  column_id: string
  title: string
  description?: string
  cover_photo?: string
  members?: string[]
  comments: Comment[]
  attachments?: string[]
  _destroy: boolean
  created_at: string
  updated_at: string
}
