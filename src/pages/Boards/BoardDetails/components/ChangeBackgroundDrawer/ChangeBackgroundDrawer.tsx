import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import InputAdornment from '@mui/material/InputAdornment'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
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
import { useUpdateBoardMutation } from '~/queries/boards'
import { useGetUnsplashSearchPhotosQuery, useUploadImageMutation } from '~/queries/medias'
import { updateActiveBoard } from '~/store/slices/board.slice'
import { singleFileValidator } from '~/utils/validators'

interface ChangeBackgroundDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
}

export default function ChangeBackgroundDrawer({ open, onOpen }: ChangeBackgroundDrawerProps) {
  const theme = useTheme()

  const [query, setQuery] = useState('Wallpapers')

  const handleInputSearchPhotosChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value

    if (!value || value.trim() === '') {
      setQuery('Wallpapers')
      return
    }

    setQuery(value)
  }

  const debounceSearchPhotos = useDebounce(handleInputSearchPhotosChange, 1500)

  const dispatch = useAppDispatch()
  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const { data: searchPhotosData, isLoading } = useGetUnsplashSearchPhotosQuery(query)
  const searchPhotos = searchPhotosData?.result || []

  const [updateBoardMutation] = useUpdateBoardMutation()
  const [uploadImageMutation] = useUploadImageMutation()

  const handleUpdateBoardCoverPhoto = async (cover_photo: string) => {
    const newActiveBoard = { ...activeBoard! }
    newActiveBoard.cover_photo = cover_photo

    dispatch(updateActiveBoard(newActiveBoard))

    updateBoardMutation({
      id: newActiveBoard._id,
      body: { cover_photo: newActiveBoard.cover_photo }
    })

    // Emit socket event to notify other users about the board background update
    socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
  }

  const handleUploadBoardCoverPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    handleUpdateBoardCoverPhoto(imageUrl)
  }

  return (
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
      open={open}
    >
      <DrawerHeader sx={{ justifyContent: 'space-between', minHeight: `${theme.trellone.navBarHeight}px!important` }}>
        <IconButton color='inherit' onClick={() => onOpen(false)}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>

        <Typography variant='subtitle1'>Background Cover</Typography>

        <Box sx={{ width: 40, height: 40 }} />
      </DrawerHeader>

      <Divider />

      <Container fixed sx={{ py: 1 }}>
        <Stack gap={1.5}>
          <Button
            variant='contained'
            size='small'
            color='secondary'
            fullWidth
            onClick={() => handleUpdateBoardCoverPhoto('')}
          >
            Remove Cover
          </Button>

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
                  <VisuallyHiddenInput type='file' accept='image/*' onChange={handleUploadBoardCoverPhoto} />
                </ListItemButton>
              </ListItem>

              {searchPhotos.map((photo) => {
                const { id, urls, description } = photo

                return (
                  <ImageListItem
                    onClick={() => handleUpdateBoardCoverPhoto(urls.regular)}
                    sx={{ p: 0 }}
                    component={ListItemButton}
                    key={id}
                  >
                    <img loading='lazy' src={urls?.thumb} alt={description ?? ''} />
                  </ImageListItem>
                )
              })}

              {isLoading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <ImageListItem sx={{ p: 0 }} key={index}>
                    <Skeleton animation='wave' variant='rectangular' width='100%' height='60px' />
                  </ImageListItem>
                ))}
            </ImageList>
          </Box>
        </Stack>
      </Container>
    </Drawer>
  )
}
