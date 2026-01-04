import EditNoteIcon from '@mui/icons-material/EditNote'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import RichTextEditor from '~/components/RichTextEditor'
import { hasHtmlContent, isMarkdownContent } from '~/utils/html-sanitizer'
import { convertMarkdownToHtml } from '~/utils/markdown-to-html'

interface CardDescriptionEditorProps {
  cardDescription: string
  onUpdateCardDescription: (cardDescription: string) => void
}

export default function CardDescriptionEditor({
  cardDescription,
  onUpdateCardDescription
}: CardDescriptionEditorProps) {
  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [editableCardDescription, setEditableCardDescription] = useState<string>('')

  // Convert markdown to HTML on mount and when description changes
  useEffect(() => {
    if (cardDescription !== undefined) {
      // Check if content is markdown and convert to HTML
      const htmlContent = isMarkdownContent(cardDescription) ? convertMarkdownToHtml(cardDescription) : cardDescription

      setEditableCardDescription(htmlContent)
    }
  }, [cardDescription])

  const handleUpdateCardDescription = () => {
    setMarkdownEditMode(false)
    onUpdateCardDescription(editableCardDescription)
  }

  const handleCardDescriptionReset = () => {
    setMarkdownEditMode(false)
    // Reset to the prepared content
    const htmlContent = isMarkdownContent(editableCardDescription)
      ? convertMarkdownToHtml(editableCardDescription)
      : editableCardDescription
    setEditableCardDescription(htmlContent)
  }

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <RichTextEditor
            content={editableCardDescription}
            onChange={(html) => setEditableCardDescription(html)}
            placeholder='Add a more detailed description...'
            height={400}
            editable={true}
            autoFocus={true}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleUpdateCardDescription}
              className='interceptor-loading'
              type='button'
              variant='contained'
              size='small'
              color='info'
            >
              Save
            </Button>
            <Button onClick={handleCardDescriptionReset} type='button' size='small'>
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
          {hasHtmlContent(editableCardDescription) ? (
            <Box
              sx={{
                padding: '10px',
                border: '0.5px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '8px'
              }}
            >
              <RichTextEditor content={editableCardDescription} editable={false} />
            </Box>
          ) : (
            <Box sx={{ padding: '10px', color: 'text.disabled', fontStyle: 'italic' }}>No description yet</Box>
          )}
        </Box>
      )}
    </Box>
  )
}
