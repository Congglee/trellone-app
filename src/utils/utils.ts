import { ColumnType } from '~/schemas/column.schema'

export const generateColorFromString = (string: string) => {
  let hash = 0

  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  const color = `#${((hash >> 16) & 0xff).toString(16).padStart(2, '0')}${((hash >> 8) & 0xff)
    .toString(16)
    .padStart(2, '0')}${(hash & 0xff).toString(16).padStart(2, '0')}`

  return color
}

export const generatePlaceholderCard = (column: ColumnType) => {
  return {
    _id: `${column._id}-placeholder-card`,
    board_id: column.board_id,
    column_id: column._id,
    title: 'Placeholder Card Title',
    description: 'Placeholder Card Description',
    cover_photo: '',
    members: [],
    comments: [],
    attachments: [],
    _destroy: false,
    created_at: new Date(),
    updated_at: new Date(),
    FE_PlaceholderCard: true
  }
}

interface InterceptorLoadingElement extends HTMLElement {
  style: CSSStyleDeclaration
}

export const interceptorLoadingElements = (calling: boolean) => {
  const elements: NodeListOf<InterceptorLoadingElement> = document.querySelectorAll('.interceptor-loading')

  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}
