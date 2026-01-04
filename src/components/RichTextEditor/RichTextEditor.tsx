import { useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import RichTextEditorToolbar from '~/components/RichTextEditor/RichTextEditorToolbar'
import { config } from '~/constants/config'
import { getTiptapExtensions } from '~/lib/tiptap'
import { useUploadImageMutation } from '~/queries/medias'
import { sanitizeHtml } from '~/utils/html-sanitizer'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'

export interface RichTextEditorProps {
  content: string
  onChange?: (html: string) => void
  placeholder?: string
  editable?: boolean
  height?: number | string
  minHeight?: number | string
  onBlur?: () => void
  onFocus?: () => void
  autoFocus?: boolean
  clearFormattingOnFocus?: boolean
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
  editable,
  height,
  minHeight,
  onBlur,
  onFocus,
  autoFocus,
  clearFormattingOnFocus
}: RichTextEditorProps) {
  const { mode } = useColorScheme()

  const previousContentRef = useRef<string>('')
  const isInitialMount = useRef(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [, forceUpdate] = useState({})

  const [uploadImageMutation] = useUploadImageMutation()

  const editor = useEditor(
    {
      extensions: getTiptapExtensions(placeholder),
      content: sanitizeHtml(content),
      editable,
      autofocus: autoFocus ? 'end' : false,
      onUpdate: ({ editor }) => {
        if (onChange) {
          const html = editor.getHTML()
          previousContentRef.current = html
          onChange(html)
        }
      },
      onSelectionUpdate: () => {
        forceUpdate({})
      },
      onTransaction: () => {
        forceUpdate({})
      },
      onBlur: () => {
        if (onBlur) {
          onBlur()
        }
      },
      onFocus: () => {
        if (onFocus) {
          onFocus()
        }
      },
      editorProps: {
        attributes: {
          class: 'tiptap-editor',
          'data-placeholder': placeholder || ''
        },
        handlePaste: (_view, event) => {
          if (!editable) return false

          const clipboardEvent = event as ClipboardEvent
          const files: File[] = []

          if (clipboardEvent.clipboardData) {
            for (const item of Array.from(clipboardEvent.clipboardData.items)) {
              if (item.kind === 'file') {
                const file = item.getAsFile()
                if (file && config.allowedImageMimeTypes.includes(file.type)) {
                  files.push(file)
                }
              }
            }

            for (const file of Array.from(clipboardEvent.clipboardData.files)) {
              if (config.allowedImageMimeTypes.includes(file.type)) {
                files.push(file)
              }
            }
          }

          if (files.length > 0) {
            event.preventDefault()
            void uploadAndInsertImages(files)
            return true
          }

          return false
        },
        handleDrop: (_view, event) => {
          if (!editable) return false

          const dragEvent = event as DragEvent
          const files: File[] = []

          if (dragEvent.dataTransfer) {
            for (const file of Array.from(dragEvent.dataTransfer.files)) {
              if (config.allowedImageMimeTypes.includes(file.type)) {
                files.push(file)
              }
            }
          }

          if (files.length > 0) {
            event.preventDefault()
            void uploadAndInsertImages(files)
            return true
          }
          return false
        }
      }
    },
    [placeholder, editable, autoFocus]
  )

  // Initialize previousContentRef after editor is created
  useEffect(() => {
    if (editor && isInitialMount.current) {
      previousContentRef.current = editor.getHTML()
      isInitialMount.current = false
    }
  }, [editor])

  // Update editor content when content prop changes from external source
  useEffect(() => {
    if (!editor) return

    const currentEditorContent = editor.getHTML()
    const sanitizedNewContent = sanitizeHtml(content)

    // Only update if:
    // 1. New content is different from current editor content
    // 2. New content is different from what we last emitted (previousContentRef)
    // This prevents updating when the change came from the editor itself
    if (sanitizedNewContent !== currentEditorContent && sanitizedNewContent !== previousContentRef.current) {
      editor.commands.setContent(sanitizedNewContent, { emitUpdate: false })
      previousContentRef.current = sanitizedNewContent
    }
  }, [content, editor])

  // Update editable state when prop changes
  useEffect(() => {
    if (editor && editable !== undefined) {
      editor.setEditable(editable)
    }
  }, [editable, editor])

  // Clear formatting marks when autofocus is enabled and clearFormattingOnFocus is true
  useEffect(() => {
    if (editor && autoFocus && clearFormattingOnFocus) {
      // Wait for content to be set and editor to be focused
      setTimeout(() => {
        if (editor.isFocused) {
          // Move cursor to end and unset all marks to prevent inheriting formatting
          editor.commands.focus('end')
          editor.commands.unsetAllMarks()
        }
      }, 50)
    }
  }, [editor, autoFocus, clearFormattingOnFocus])

  if (!editor) {
    return null
  }

  const handleTriggerImagePicker = () => {
    if (!editable) return
    fileInputRef.current?.click()
  }

  const uploadAndInsertImages = async (files: File[] | FileList) => {
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      const errorMessage = singleFileValidator(file)

      if (errorMessage) {
        // Skip invalid files silently
        continue
      }

      const formData = new FormData()

      formData.append('image', file)

      try {
        const uploadImageRes = await toast.promise(uploadImageMutation(formData).unwrap(), {
          pending: 'Uploading...',
          success: 'Upload successfully!',
          error: 'Upload failed!'
        })

        const imageUrl = uploadImageRes.result[0]?.url

        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run()
        }
      } catch {
        // Ignore upload failures silently
      }
    }
  }

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files || files.length === 0) return

    await uploadAndInsertImages(files)

    // Reset input so the same file can be selected again if needed
    event.target.value = ''
  }

  const editorContainerStyles: SxProps<Theme> = {
    border: '0.5px solid',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.87)'
    },
    '&:focus-within': {
      borderColor: 'primary.main',
      borderWidth: '1px'
    },
    overflow: 'hidden',
    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff'),
    ...(editable ? {} : { border: 'none', backgroundColor: 'transparent' })
  }

  const editorContentStyles: SxProps<Theme> = {
    '& .ProseMirror': {
      padding: editable ? 2 : 0,
      minHeight: editable ? minHeight || 100 : 'auto',
      height: height,
      maxHeight: height,
      overflowY: height ? 'auto' : 'visible',
      outline: 'none',
      fontSize: '0.875rem',
      fontFamily: 'Rubik, sans-serif',
      lineHeight: 1.6,
      color: 'text.primary',
      cursor: editable ? 'text' : 'default',

      '&:focus': {
        outline: 'none'
      },

      // Placeholder styles
      '&.is-editor-empty::before': {
        content: 'attr(data-placeholder)',
        float: 'left',
        color: 'text.disabled',
        pointerEvents: 'none',
        height: 0
      },

      // Paragraphs
      '& p': {
        margin: 0,
        marginBottom: '0.5em',
        '&:last-child': {
          marginBottom: 0
        }
      },

      // Headings
      '& h1': {
        fontSize: '1.75rem',
        fontWeight: 600,
        marginTop: '1em',
        marginBottom: '0.5em',
        lineHeight: 1.2,
        '&:first-of-type': {
          marginTop: 0
        }
      },
      '& h2': {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginTop: '0.75em',
        marginBottom: '0.5em',
        lineHeight: 1.3,
        '&:first-of-type': {
          marginTop: 0
        }
      },
      '& h3': {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginTop: '0.5em',
        marginBottom: '0.5em',
        lineHeight: 1.4,
        '&:first-of-type': {
          marginTop: 0
        }
      },
      '& h4': {
        fontSize: '1.125rem',
        fontWeight: 600,
        marginTop: '0.5em',
        marginBottom: '0.5em',
        lineHeight: 1.5,
        '&:first-of-type': {
          marginTop: 0
        }
      },
      '& h5': {
        fontSize: '1rem',
        fontWeight: 600,
        marginTop: '0.5em',
        marginBottom: '0.5em',
        lineHeight: 1.5,
        '&:first-of-type': {
          marginTop: 0
        }
      },
      '& h6': {
        fontSize: '0.875rem',
        fontWeight: 600,
        marginTop: '0.5em',
        marginBottom: '0.5em',
        lineHeight: 1.5,
        '&:first-of-type': {
          marginTop: 0
        }
      },

      // Lists
      '& ul, & ol': {
        paddingLeft: '1.5em',
        marginTop: '0.5em',
        marginBottom: '0.5em'
      },
      '& li': {
        marginBottom: '0.25em',
        '& > p': {
          marginBottom: '0.25em'
        }
      },

      // Code
      '& code': {
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5'),
        color: (theme) => (theme.palette.mode === 'dark' ? '#e06c75' : '#c7254e'),
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '0.85em',
        fontFamily: 'monospace'
      },

      // Code blocks
      '& pre': {
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f8f8'),
        color: (theme) => (theme.palette.mode === 'dark' ? '#d4d4d4' : '#333333'),
        borderRadius: '4px',
        padding: '1em',
        marginTop: '0.5em',
        marginBottom: '0.5em',
        overflow: 'auto',
        '& code': {
          backgroundColor: 'transparent',
          color: 'inherit',
          padding: 0,
          fontSize: '0.875rem'
        }
      },

      // Links
      '& a': {
        color: 'primary.main',
        textDecoration: 'underline',
        cursor: 'pointer',
        '&:hover': {
          color: 'primary.dark'
        }
      },

      // Images
      '& img, & .tiptap-image': {
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        marginTop: '0.5em',
        marginBottom: '0.5em',
        borderRadius: '4px',
        objectFit: 'contain'
      },

      // Blockquotes
      '& blockquote': {
        borderLeft: '3px solid',
        borderColor: 'divider',
        paddingLeft: '1em',
        marginLeft: 0,
        marginTop: '0.5em',
        marginBottom: '0.5em',
        color: 'text.secondary',
        fontStyle: 'italic'
      },

      // Horizontal rule
      '& hr': {
        border: 'none',
        borderTop: '1px solid',
        borderColor: 'divider',
        marginTop: '1em',
        marginBottom: '1em'
      },

      // Strong/Bold
      '& strong': {
        fontWeight: 700
      },

      // Emphasis/Italic
      '& em': {
        fontStyle: 'italic'
      },

      // Underline
      '& u': {
        textDecoration: 'underline'
      },

      // Strike
      '& s': {
        textDecoration: 'line-through'
      }
    }
  }

  return (
    <Box sx={editorContainerStyles} data-color-mode={mode}>
      {editable && <RichTextEditorToolbar editor={editor} onInsertImage={handleTriggerImagePicker} />}
      <Box sx={editorContentStyles}>
        {editable && (
          <VisuallyHiddenInput
            ref={fileInputRef}
            type='file'
            accept={config.allowedImageMimeTypes.join(',')}
            onChange={handleFileInputChange}
          />
        )}
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}
