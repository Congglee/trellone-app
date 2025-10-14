import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import InfoIcon from '@mui/icons-material/Info'
import PersonIcon from '@mui/icons-material/Person'
import SubjectIcon from '@mui/icons-material/Subject'
import { Link as MuiLink, useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DrawerHeader from '~/components/DrawerHeader'
import RichTextEditor from '~/components/RichTextEditor'
import path from '~/constants/path'
import { BoardRole } from '~/constants/type'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useUpdateBoardMutation } from '~/queries/boards'
import { BoardMemberType } from '~/schemas/board.schema'
import { updateActiveBoard } from '~/store/slices/board.slice'
import { hasHtmlContent, isMarkdownContent } from '~/utils/html-sanitizer'
import { convertMarkdownToHtml } from '~/utils/markdown-to-html'

interface BoardInfomationProps {
  boardMembers: BoardMemberType[]
  isCurrentUserAdmin: boolean
  boardDescription?: string
  canEditBoardInfo: boolean
}

export default function BoardInfomation({
  boardMembers,
  isCurrentUserAdmin,
  boardDescription: initialDescription,
  canEditBoardInfo
}: BoardInfomationProps) {
  const theme = useTheme()
  const [boardInformationDrawerOpen, setBoardInformationDrawerOpen] = useState(false)
  const [descriptionEditMode, setDescriptionEditMode] = useState(false)
  const [boardDescription, setBoardDescription] = useState<string>('')

  const boardAdmins = useMemo(() => {
    return boardMembers.filter((member) => member.role === BoardRole.Admin)
  }, [boardMembers])

  const DESCRIPTION_PLACEHOLDER =
    "Add a description to let your teammates know what this board is used for. You'll get bonus points if you add instructions for how to collaborate!"

  // Convert markdown to HTML on mount and when description changes
  useEffect(() => {
    if (initialDescription && initialDescription.trim() !== '') {
      // Check if content is markdown and convert to HTML
      const htmlContent = isMarkdownContent(initialDescription)
        ? convertMarkdownToHtml(initialDescription)
        : initialDescription

      setBoardDescription(htmlContent)
    } else {
      // Set empty string when description is empty or undefined
      setBoardDescription('')
    }
  }, [initialDescription])

  const dispatch = useAppDispatch()

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const [updateBoardMutation] = useUpdateBoardMutation()

  const updateBoardDescription = () => {
    setDescriptionEditMode(false)

    updateBoardMutation({
      id: activeBoard?._id as string,
      body: { description: boardDescription }
    }).then((res) => {
      if (!res.error) {
        const newActiveBoard = { ...activeBoard! }
        newActiveBoard.description = boardDescription

        dispatch(updateActiveBoard(newActiveBoard))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
      }
    })
  }

  const resetDescription = () => {
    setDescriptionEditMode(false)
    // Reset to the actual content
    if (initialDescription && initialDescription.trim() !== '') {
      const htmlContent = isMarkdownContent(initialDescription)
        ? convertMarkdownToHtml(initialDescription)
        : initialDescription
      setBoardDescription(htmlContent)
    } else {
      // Reset to empty string when description is empty or undefined
      setBoardDescription('')
    }
  }

  const handleBoardInformationDrawerClose = () => {
    setBoardInformationDrawerOpen(false)
    if (descriptionEditMode) {
      resetDescription()
    }
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setBoardInformationDrawerOpen(true)}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText secondary='About this board' />
        </ListItemButton>
      </ListItem>

      <Drawer
        sx={{
          width: theme.trellone.boardDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: theme.trellone.boardDrawerWidth,
            boxSizing: 'border-box',
            top: `calc(${theme.trellone.navBarHeight} + 1px)`
          }
        }}
        variant='persistent'
        anchor='right'
        open={boardInformationDrawerOpen}
      >
        <DrawerHeader
          sx={{
            justifyContent: 'space-between',
            minHeight: `${theme.trellone.navBarHeight}px!important`,
            px: 1
          }}
        >
          <IconButton color='inherit' onClick={handleBoardInformationDrawerClose} aria-label='Go back'>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>

          <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
            About this board
          </Typography>

          <IconButton
            color='inherit'
            onClick={handleBoardInformationDrawerClose}
            aria-label='Close drawer'
            sx={{ opacity: 0.7 }}
          >
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Board admins
                </Typography>
              </Box>

              <Stack spacing={2}>
                {boardAdmins.map((admin) => (
                  <Box key={admin.user_id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Avatar
                      src={admin.avatar}
                      alt={admin.display_name}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main'
                      }}
                    >
                      {admin.display_name.charAt(0)}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 0.25,
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                      >
                        {admin.display_name}
                      </Typography>

                      <Typography
                        variant='body2'
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.8125rem',
                          mb: 1
                        }}
                      >
                        @{admin.username}
                      </Typography>

                      {isCurrentUserAdmin && (
                        <MuiLink
                          component={Link}
                          to={path.accountSettings}
                          underline='hover'
                          sx={{
                            fontSize: '0.8125rem',
                            color: 'text.secondary',
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'text.primary'
                            }
                          }}
                        >
                          Edit profile info
                        </MuiLink>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SubjectIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Description
                  </Typography>
                </Box>
                {canEditBoardInfo && hasHtmlContent(boardDescription) && !descriptionEditMode && (
                  <IconButton
                    size='small'
                    onClick={() => setDescriptionEditMode(true)}
                    sx={{
                      opacity: 0.7,
                      '&:hover': {
                        opacity: 1
                      }
                    }}
                    aria-label='Edit description'
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>

              {descriptionEditMode ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <RichTextEditor
                    content={boardDescription}
                    onChange={(html) => setBoardDescription(html)}
                    placeholder='Add a more detailed description...'
                    height={250}
                    editable={true}
                    autoFocus={true}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      onClick={updateBoardDescription}
                      className='interceptor-loading'
                      type='button'
                      variant='contained'
                      size='small'
                      color='info'
                    >
                      Save
                    </Button>
                    <Button onClick={resetDescription} type='button' size='small'>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {hasHtmlContent(boardDescription) ? (
                    <Box
                      sx={{
                        padding: '10px',
                        border: '0.5px solid rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px',
                        cursor: canEditBoardInfo ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: canEditBoardInfo ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)',
                          boxShadow: canEditBoardInfo ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                        }
                      }}
                      onClick={() => {
                        if (canEditBoardInfo) {
                          setDescriptionEditMode(true)
                        }
                      }}
                    >
                      <RichTextEditor content={boardDescription} editable={false} height={250} />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.100'),
                        borderRadius: 1,
                        cursor: canEditBoardInfo ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: (theme) =>
                            canEditBoardInfo
                              ? theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'grey.200'
                              : theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'grey.100'
                        }
                      }}
                      onClick={() => {
                        if (canEditBoardInfo) {
                          setDescriptionEditMode(true)
                        }
                      }}
                    >
                      <Typography
                        variant='body2'
                        sx={{
                          color: 'text.disabled',
                          fontSize: '0.8125rem',
                          lineHeight: 1.6,
                          fontStyle: 'italic'
                        }}
                      >
                        {DESCRIPTION_PLACEHOLDER}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </>
  )
}
