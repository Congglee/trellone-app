import EditNoteIcon from '@mui/icons-material/EditNote'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import RichTextEditor from '~/components/RichTextEditor'
import { hasHtmlContent, isMarkdownContent } from '~/utils/html-sanitizer'
import { convertMarkdownToHtml } from '~/utils/markdown-to-html'

interface CardDescriptionEditorProps {
  description: string
  onUpdateCardDescription: (description: string) => void
}

export default function CardDescriptionEditor({ description, onUpdateCardDescription }: CardDescriptionEditorProps) {
  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState<string>('')

  // Convert markdown to HTML on mount and when description changes
  useEffect(() => {
    if (description !== undefined) {
      // Check if content is markdown and convert to HTML
      const htmlContent = isMarkdownContent(description) ? convertMarkdownToHtml(description) : description

      setCardDescription(htmlContent)
    }
  }, [description])

  const updateCardDescription = () => {
    setMarkdownEditMode(false)
    onUpdateCardDescription(cardDescription)
  }

  const reset = () => {
    setMarkdownEditMode(false)
    // Reset to the prepared content
    const htmlContent = isMarkdownContent(description) ? convertMarkdownToHtml(description) : description
    setCardDescription(htmlContent)
  }

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <RichTextEditor
            content={cardDescription}
            onChange={(html) => setCardDescription(html)}
            placeholder='Add a more detailed description...'
            height={400}
            editable={true}
            autoFocus={true}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={updateCardDescription}
              className='interceptor-loading'
              type='button'
              variant='contained'
              size='small'
              color='info'
            >
              Save
            </Button>
            <Button onClick={reset} type='button' size='small'>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setMarkdownEditMode(true)}
            type='button'
            variant='contained'
            color='info'
            size='small'
            startIcon={<EditNoteIcon />}
          >
            Edit
          </Button>
          {hasHtmlContent(cardDescription) ? (
            <Box
              sx={{
                padding: '10px',
                border: '0.5px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '8px'
              }}
            >
              <RichTextEditor content={cardDescription} editable={false} />
            </Box>
          ) : (
            <Box sx={{ padding: '10px', color: 'text.disabled', fontStyle: 'italic' }}>No description yet</Box>
          )}
        </Box>
      )}
    </Box>
  )
}
