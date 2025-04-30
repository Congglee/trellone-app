import { useColorScheme } from '@mui/material'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import Button from '@mui/material/Button'
import EditNoteIcon from '@mui/icons-material/EditNote'

interface CardDescriptionMdEditorProps {
  description: string
  onUpdateCardDescription: (description: string) => Promise<void>
}

export default function CardDescriptionMdEditor({
  description,
  onUpdateCardDescription
}: CardDescriptionMdEditorProps) {
  const { mode } = useColorScheme()

  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState<string>(description)

  // Update local state when the description prop changes (e.g., from realtime updates)
  useEffect(() => {
    if (description !== undefined && description !== cardDescription) {
      setCardDescription(description)
    }
  }, [description])

  const updateCardDescription = () => {
    setMarkdownEditMode(false)
    onUpdateCardDescription(cardDescription)
  }

  const reset = () => {
    setMarkdownEditMode(false)
    setCardDescription(description)
  }

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={(value) => setCardDescription(value as string)}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }} // Sanitize the markdown content
              height={400}
              preview='edit'
              // hideToolbar={true} // Uncomment this line to hide the toolbar
            />
          </Box>
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
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: cardDescription ? '10px' : '0px',
                border: cardDescription ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px'
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}
