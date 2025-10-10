import CodeIcon from '@mui/icons-material/Code'
import ImageIcon from '@mui/icons-material/Image'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import RedoIcon from '@mui/icons-material/Redo'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import UndoIcon from '@mui/icons-material/Undo'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { SxProps, Theme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import type { Editor } from '@tiptap/react'
import { Fragment } from 'react'

interface RichTextEditorToolbarProps {
  editor: Editor
  onInsertImage?: () => void
}

interface ToolbarButton {
  icon: React.ReactNode
  title: string
  action: () => void
  isActive?: boolean
  disabled?: boolean
}

export default function RichTextEditorToolbar({ editor, onInsertImage }: RichTextEditorToolbarProps) {
  const toolbarStyles: SxProps<Theme> = {
    display: 'flex',
    flexWrap: 'wrap',
    py: 1,
    px: 2,
    borderBottom: '0.5px solid',
    borderColor: 'divider',
    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2a2a2a' : '#fafafa')
  }

  const getToolbarButtonStyles = (isActive: boolean): SxProps<Theme> => ({
    minWidth: '32px',
    width: '32px',
    height: '32px',
    padding: 0.5,
    borderRadius: '4px',
    border: '0.5px solid',
    borderColor: isActive ? 'primary.main' : 'transparent',
    backgroundColor: isActive ? 'primary.main' : 'transparent',
    color: isActive ? 'white' : 'text.primary',
    '&:hover': {
      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
      borderColor: isActive ? 'primary.dark' : 'action.hover'
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  })

  const getCurrentHeadingLevel = () => {
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive('heading', { level })) {
        return level
      }
    }
    return 0 // Paragraph
  }

  const handleHeadingChange = (value: number) => {
    if (value === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: value as 1 | 2 | 3 | 4 | 5 | 6 })
        .run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const buttons: ToolbarButton[] = [
    {
      icon: <FormatBoldIcon fontSize='small' />,
      title: 'Bold (Ctrl+B)',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      disabled: !editor.can().chain().focus().toggleBold().run()
    },
    {
      icon: <FormatItalicIcon fontSize='small' />,
      title: 'Italic (Ctrl+I)',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      disabled: !editor.can().chain().focus().toggleItalic().run()
    },
    {
      icon: <FormatUnderlinedIcon fontSize='small' />,
      title: 'Underline (Ctrl+U)',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      disabled: !editor.can().chain().focus().toggleUnderline().run()
    },
    {
      icon: <StrikethroughSIcon fontSize='small' />,
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      disabled: !editor.can().chain().focus().toggleStrike().run()
    },
    {
      icon: <CodeIcon fontSize='small' />,
      title: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      disabled: !editor.can().chain().focus().toggleCode().run()
    },
    {
      icon: <FormatListBulletedIcon fontSize='small' />,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      disabled: !editor.can().chain().focus().toggleBulletList().run()
    },
    {
      icon: <FormatListNumberedIcon fontSize='small' />,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      disabled: !editor.can().chain().focus().toggleOrderedList().run()
    },
    {
      icon: <FormatQuoteIcon fontSize='small' />,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      disabled: !editor.can().chain().focus().toggleBlockquote().run()
    },
    {
      icon: <ImageIcon fontSize='small' />,
      title: 'Insert Image',
      action: () => {
        if (onInsertImage) onInsertImage()
      },
      isActive: false,
      disabled: !editor.isEditable
    },
    {
      icon: <LinkIcon fontSize='small' />,
      title: 'Add Link',
      action: setLink,
      isActive: editor.isActive('link'),
      disabled: false
    },
    {
      icon: <LinkOffIcon fontSize='small' />,
      title: 'Remove Link',
      action: () => editor.chain().focus().unsetLink().run(),
      isActive: false,
      disabled: !editor.isActive('link')
    },
    {
      icon: <FormatClearIcon fontSize='small' />,
      title: 'Clear Format',
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
      isActive: false,
      disabled: false
    },
    {
      icon: <UndoIcon fontSize='small' />,
      title: 'Undo (Ctrl+Z)',
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      disabled: !editor.can().chain().focus().undo().run()
    },
    {
      icon: <RedoIcon fontSize='small' />,
      title: 'Redo (Ctrl+Shift+Z)',
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      disabled: !editor.can().chain().focus().redo().run()
    }
  ]

  return (
    <Box sx={toolbarStyles}>
      <Select
        value={getCurrentHeadingLevel()}
        onChange={(e) => handleHeadingChange(e.target.value as number)}
        size='small'
        sx={{
          minWidth: '120px',
          height: '32px',
          fontSize: '0.875rem',
          '& .MuiSelect-select': {
            py: 0.5,
            px: 1
          }
        }}
      >
        <MenuItem value={0}>Paragraph</MenuItem>
        <MenuItem value={1}>Heading 1</MenuItem>
        <MenuItem value={2}>Heading 2</MenuItem>
        <MenuItem value={3}>Heading 3</MenuItem>
        <MenuItem value={4}>Heading 4</MenuItem>
        <MenuItem value={5}>Heading 5</MenuItem>
        <MenuItem value={6}>Heading 6</MenuItem>
      </Select>

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5, alignSelf: 'center' }} />

      {buttons.map((button, index) => (
        <Fragment key={index}>
          {index === 11 && <Divider orientation='vertical' flexItem sx={{ mx: 0.5, alignSelf: 'center' }} />}
          <Tooltip title={button.title} arrow>
            <span>
              <IconButton
                onClick={button.action}
                disabled={button.disabled}
                sx={getToolbarButtonStyles(button.isActive || false)}
                size='small'
              >
                {button.icon}
              </IconButton>
            </span>
          </Tooltip>
        </Fragment>
      ))}
    </Box>
  )
}
