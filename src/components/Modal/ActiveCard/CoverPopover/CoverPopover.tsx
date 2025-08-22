import CloseIcon from '@mui/icons-material/Close'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useState } from 'react'
import { toast } from 'react-toastify'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import PhotoSearch from '~/components/Modal/ActiveCard/CoverPopover/PhotoSearch'
import { useGetUnsplashSearchPhotosQuery, useUploadImageMutation } from '~/queries/medias'
import { singleFileValidator } from '~/utils/validators'

interface CoverPopoverProps {
  onUpdateCardCoverPhoto: (cover_photo: string) => Promise<void>
}

export default function CoverPopover({ onUpdateCardCoverPhoto }: CoverPopoverProps) {
  const [anchorCoverPopoverElement, setAnchorCoverPopoverElement] = useState<HTMLElement | null>(null)
  const isCoverPopoverOpen = Boolean(anchorCoverPopoverElement)

  const popoverId = isCoverPopoverOpen ? 'cover-popover' : undefined

  const [showCoverPhoto, setShowCoverPhoto] = useState(false)
  const [showUnsplashPhotoSearch, setShowUnsplashPhotoSearch] = useState(false)

  const [searchQuery, setSearchQuery] = useState('Wallpapers')

  const { data: searchPhotosData } = useGetUnsplashSearchPhotosQuery(searchQuery || 'Wallpapers')
  const searchPhotos = searchPhotosData?.result || []

  const [uploadImageMutation] = useUploadImageMutation()

  const onSearchQueryChange = (query: string) => {
    setSearchQuery(query)
  }

  const toggleCoverPopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!anchorCoverPopoverElement) {
      setAnchorCoverPopoverElement(event.currentTarget)
      setShowCoverPhoto(true)
    } else {
      setAnchorCoverPopoverElement(null)
      setShowCoverPhoto(false)
    }
  }

  const handleCoverPopoverClose = () => {
    setAnchorCoverPopoverElement(null)
    setShowCoverPhoto(false)
    setShowUnsplashPhotoSearch(false)
  }

  const onBackToCoverPhoto = () => {
    setShowUnsplashPhotoSearch(false)
    setShowCoverPhoto(true)
  }

  const uploadCardCoverPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    onUpdateCardCoverPhoto(imageUrl).finally(() => {
      event.target.value = ''
    })
  }

  return (
    <>
      <Button
        color='inherit'
        fullWidth
        onClick={toggleCoverPopover}
        sx={{
          p: '10px',
          fontWeight: '600',
          lineHeight: 'inherit',
          gap: '6px',
          justifyContent: 'flex-start',
          transition: 'none'
        }}
      >
        <ImageOutlinedIcon fontSize='small' />
        <span>Cover</span>
      </Button>

      <Popover
        id={popoverId}
        open={isCoverPopoverOpen}
        anchorEl={anchorCoverPopoverElement}
        onClose={handleCoverPopoverClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              width: 350,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1,
              display: !isCoverPopoverOpen ? 'none' : 'block'
            }
          }
        }}
      >
        {showCoverPhoto && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2
              }}
            >
              <IconButton size='small' sx={{ padding: 0, opacity: 0, visibility: 'hidden' }}>
                <InfoOutlinedIcon />
              </IconButton>
              <Typography
                variant='h6'
                component='div'
                sx={{
                  textAlign: 'center',
                  flexGrow: 1,
                  fontWeight: 600
                }}
              >
                Cover
              </Typography>
              <IconButton onClick={handleCoverPopoverClose} size='small'>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Button
                variant='contained'
                size='small'
                color='inherit'
                fullWidth
                sx={{ py: 0.75, px: 1.5 }}
                onClick={() => onUpdateCardCoverPhoto('')}
              >
                Remove cover
              </Button>
            </Box>

            <Divider />

            <Box sx={{ mt: 1, mb: 3 }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
                Attachments
              </Typography>

              <Button
                variant='contained'
                size='small'
                color='inherit'
                component='label'
                fullWidth
                sx={{ mb: 1, py: 0.75, px: 1.5 }}
              >
                Upload a cover image
                <VisuallyHiddenInput type='file' accept='image/*' onChange={uploadCardCoverPhoto} />
              </Button>

              <Typography
                variant='body2'
                sx={{
                  color: (theme) => (theme.palette.mode === 'dark' ? '#9fadbc' : '#5e6c84'),
                  fontSize: '0.75rem',
                  fontStyle: 'italic'
                }}
              >
                Tip: Drag an image on to the card to upload it.
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
                Photos from Unsplash
              </Typography>
              <Grid container spacing={1}>
                {searchPhotos?.length > 0 ? (
                  searchPhotos.slice(0, 6).map((photo) => (
                    <Grid xs={4} key={photo.id}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 60,
                          backgroundImage: `url(${photo.urls.thumb})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: 1,
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: 'grey.300',
                          '&:hover': {
                            opacity: 0.8
                          }
                        }}
                        onClick={() => onUpdateCardCoverPhoto(photo.urls.regular)}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid xs={12}>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      No photos found
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Box>
              <Button
                variant='contained'
                size='small'
                color='inherit'
                fullWidth
                sx={{ py: 0.75, px: 1.5 }}
                onClick={() => {
                  setShowCoverPhoto(false)
                  setShowUnsplashPhotoSearch(true)
                }}
              >
                Search for photos
              </Button>

              <Typography
                variant='caption'
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  color: (theme) => (theme.palette.mode === 'dark' ? '#8c9bad' : '#6b778c'),
                  mt: 1,
                  fontSize: '0.7rem'
                }}
              >
                By using images from Unsplash, you agree to their{' '}
                <Box
                  component='span'
                  sx={{
                    color: (theme) => (theme.palette.mode === 'dark' ? '#579dff' : '#0052cc'),
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  license
                </Box>{' '}
                and{' '}
                <Box
                  component='span'
                  sx={{
                    color: (theme) => (theme.palette.mode === 'dark' ? '#579dff' : '#0052cc'),
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Terms of Service
                </Box>
              </Typography>
            </Box>
          </Box>
        )}

        {showUnsplashPhotoSearch && (
          <PhotoSearch
            onClose={handleCoverPopoverClose}
            onBackToCoverPhoto={onBackToCoverPhoto}
            searchPhotos={searchPhotos}
            onUpdateCardCoverPhoto={onUpdateCardCoverPhoto}
            onSearchQueryChange={onSearchQueryChange}
          />
        )}
      </Popover>
    </>
  )
}
