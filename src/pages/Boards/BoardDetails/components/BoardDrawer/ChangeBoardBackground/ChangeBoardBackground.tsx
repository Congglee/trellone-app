import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ImageIcon from '@mui/icons-material/Image'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import InputAdornment from '@mui/material/InputAdornment'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { toast } from 'react-toastify'
import DrawerHeader from '~/components/DrawerHeader'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { useDebounce } from '~/hooks/use-debounce'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import ColorPicker from '~/pages/Boards/BoardDetails/components/BoardDrawer/ChangeBoardBackground/ColorPicker'
import { useUpdateBoardMutation } from '~/queries/boards'
import { useGetUnsplashSearchPhotosQuery, useUploadImageMutation } from '~/queries/medias'
import { updateActiveBoard } from '~/store/slices/board.slice'
import { singleFileValidator } from '~/utils/validators'

interface ChangeBoardBackgroundProps {
  canChangeBoardBackground: boolean
}

export default function ChangeBoardBackground({ canChangeBoardBackground }: ChangeBoardBackgroundProps) {
  const theme = useTheme()

  const [query, setQuery] = useState('Wallpapers')
  const [changeBackgroundDrawerOpen, setChangeBackgroundDrawerOpen] = useState(false)

  const handleInputSearchPhotosChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value

    if (!value || value.trim() === '') {
      setQuery('Wallpapers')
      return
    }

    setQuery(value)
  }

  const debounceSearchPhotos = useDebounce(handleInputSearchPhotosChange, 1000)

  const dispatch = useAppDispatch()
  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const hasCoverPhoto = activeBoard?.cover_photo && activeBoard.cover_photo.trim() !== ''
  const hasBackgroundColor = activeBoard?.background_color && activeBoard.background_color.trim() !== ''

  const { data: searchPhotosData, isLoading } = useGetUnsplashSearchPhotosQuery(query, {
    skip: !changeBackgroundDrawerOpen
  })
  const searchPhotos = searchPhotosData?.result || []

  const [updateBoardMutation] = useUpdateBoardMutation()
  const [uploadImageMutation] = useUploadImageMutation()

  const updateBoardCoverPhoto = (coverPhoto: string) => {
    updateBoardMutation({
      id: activeBoard?._id as string,
      body: { cover_photo: coverPhoto, background_color: '' }
    }).then((res) => {
      if (!res.error) {
        const newActiveBoard = { ...activeBoard! }

        newActiveBoard.cover_photo = coverPhoto
        newActiveBoard.background_color = ''

        dispatch(updateActiveBoard(newActiveBoard))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', newActiveBoard.workspace_id)
      }
    })
  }

  const uploadBoardCoverPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    const errorMessage = singleFileValidator(file as File)

    if (errorMessage) {
      toast.error(errorMessage, { position: 'top-center' })
      return
    }

    const formData = new FormData()

    formData.append('image', file as File)

    const uploadImageRes = await toast.promise(uploadImageMutation(formData).unwrap(), {
      pending: 'Uploading...',
      success: 'Upload successfully!',
      error: 'Upload failed!'
    })

    const imageUrl = uploadImageRes.result[0].url

    updateBoardCoverPhoto(imageUrl)
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setChangeBackgroundDrawerOpen(true)} disabled={!canChangeBoardBackground}>
          <ListItemIcon>
            {hasCoverPhoto ? (
              <Avatar
                src={activeBoard.cover_photo}
                alt='Board cover'
                variant='rounded'
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 1,
                  objectFit: 'cover'
                }}
              />
            ) : hasBackgroundColor ? (
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 1,
                  bgcolor: activeBoard.background_color,
                  background: activeBoard.background_color,
                  backgroundSize: 'cover'
                }}
              />
            ) : (
              <Avatar
                variant='rounded'
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'action.hover',
                  boxShadow: 1
                }}
              >
                <ImageIcon sx={{ color: 'text.disabled', fontSize: '1rem' }} />
              </Avatar>
            )}
          </ListItemIcon>
          <ListItemText secondary='Change background' />
        </ListItemButton>
      </ListItem>

      <Drawer
        sx={{
          width: theme.trellone.boardDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            top: `calc(${theme.trellone.navBarHeight} + 1px)`
          }
        }}
        variant='persistent'
        anchor='right'
        open={changeBackgroundDrawerOpen}
      >
        <DrawerHeader sx={{ justifyContent: 'space-between', minHeight: `${theme.trellone.navBarHeight}px!important` }}>
          <IconButton color='inherit' onClick={() => setChangeBackgroundDrawerOpen(false)} aria-label='Go back'>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>

          <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
            Change background
          </Typography>

          <Box sx={{ width: 40, height: 40 }} />
        </DrawerHeader>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Stack gap={1.5}>
            <ColorPicker />

            <Box>
              <Typography variant='caption' fontWeight={500}>
                Options
              </Typography>

              <TextField
                fullWidth
                size='small'
                placeholder='Image'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                onChange={debounceSearchPhotos}
              />

              <ImageList variant='standard' cols={3} gap={3} sx={{ mt: 1 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      p: 0,
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center'
                    }}
                    component='label'
                  >
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <VisuallyHiddenInput type='file' accept='image/*' onChange={uploadBoardCoverPhoto} />
                  </ListItemButton>
                </ListItem>

                {searchPhotos.map((photo) => {
                  const { id, urls, description } = photo

                  return (
                    <ImageListItem
                      onClick={() => updateBoardCoverPhoto(urls.regular)}
                      sx={{ p: 0 }}
                      component={ListItemButton}
                      key={id}
                    >
                      <img loading='lazy' src={urls?.thumb} alt={description ?? ''} />
                    </ImageListItem>
                  )
                })}

                {isLoading &&
                  Array.from({ length: 12 }).map((_, index) => (
                    <ImageListItem sx={{ p: 0 }} key={index}>
                      <Skeleton animation='wave' variant='rectangular' width='100%' height='60px' />
                    </ImageListItem>
                  ))}
              </ImageList>
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </>
  )
}
