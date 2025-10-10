import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import type { Extensions } from '@tiptap/react'

export const getTiptapExtensions = (placeholder?: string): Extensions => {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6]
      },
      codeBlock: {
        HTMLAttributes: {
          class: 'tiptap-code-block'
        }
      }
      // Note: StarterKit includes History by default with reasonable settings
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'tiptap-image'
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'tiptap-link'
      },
      validate: (href) => /^https?:\/\//.test(href)
    }),
    Placeholder.configure({
      placeholder: placeholder || 'Start typing...',
      emptyEditorClass: 'is-editor-empty'
    }),
    Underline
  ]
}
