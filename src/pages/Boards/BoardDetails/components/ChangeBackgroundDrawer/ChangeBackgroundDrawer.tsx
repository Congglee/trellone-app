import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import DrawerHeader from '~/components/DrawerHeader'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useUpdateBoardMutation } from '~/queries/boards'
import { useGetUnsplashSearchPhotosQuery, useUploadImageMutation } from '~/queries/medias'
import { updateActiveBoard } from '~/store/slices/board.slice'
import AddIcon from '@mui/icons-material/Add'
import ListItemIcon from '@mui/material/ListItemIcon'

// @ts-expect-error - Missing type definitions for mui-color-input package
import { MuiColorInput, MuiColorInputValue } from 'mui-color-input'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { config } from '~/constants/config'
import { toast } from 'react-toastify'

interface ChangeBackgroundDrawerProps {
  open: boolean
  onOpen: (open: boolean) => void
}

export default function ChangeBackgroundDrawer({ open, onOpen }: ChangeBackgroundDrawerProps) {
  const theme = useTheme()

  const [value, setValue] = useState<MuiColorInputValue>('')

  const handleColorInputChange = (newValue: string) => {
    setValue(newValue)
  }

  const dispatch = useAppDispatch()
  const { activeBoard } = useAppSelector((state) => state.board)

  const { data: searchPhotosData } = useGetUnsplashSearchPhotosQuery('Wallpapers')
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
  }

  const handleUploadBoardCoverPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file && (file.size >= config.maxSizeUploadAvatar || !file.type.includes('image'))) {
      toast.error('Maximum file size is 3MB and file type must be an image.', { position: 'top-center' })
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
        '& .MuiDrawer-paper': { top: `${theme.trellone.navBarHeight}` }
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
          <Button variant='contained' size='small' color='secondary' fullWidth>
            Remove Cover
          </Button>

          <Box>
            <Typography variant='caption' fontWeight={500}>
              Colors
            </Typography>
            <MuiColorInput size='small' fullWidth value={value} onChange={handleColorInputChange} format='hex8' />{' '}
          </Box>

          <Box>
            <Typography variant='caption' fontWeight={500}>
              Options
            </Typography>

            <ImageList variant='standard' cols={3} gap={2}>
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

              {searchPhotos?.length > 0 &&
                searchPhotos.map((photo) => {
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
            </ImageList>
          </Box>
        </Stack>
      </Container>
    </Drawer>
  )
}
