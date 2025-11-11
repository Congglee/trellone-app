import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MuiLink from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useDebounce } from '~/hooks/use-debounce'
import { UnsplashSearchPhotosType } from '~/schemas/media.schema'

interface PhotoSearchProps {
  onClose: () => void
  onBackToCoverPhoto: () => void
  onUpdateCardCoverPhoto: (cover_photo: string) => Promise<void>
  onSearchQueryChange: (query: string) => void
  searchPhotos: UnsplashSearchPhotosType['result']
}

const suggestedSearches = [
  'Productivity',
  'Perspective',
  'Organization',
  'Colorful',
  'Nature',
  'Business',
  'Minimal',
  'Space',
  'Animals'
]

export default function PhotoSearch({
  onClose,
  onBackToCoverPhoto,
  onUpdateCardCoverPhoto,
  onSearchQueryChange,
  searchPhotos
}: PhotoSearchProps) {
  const debounceSearchPhotos = useDebounce(onSearchQueryChange, 1000)

  return (
    <Box
      sx={{
        height: 600,
        color: (theme) => (theme.palette.mode === 'dark' ? '#ecf0f1' : '#2c3e50'),
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <IconButton
          onClick={onBackToCoverPhoto}
          size='small'
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? '#bdc3c7' : '#7f8c8d')
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography
          variant='h6'
          sx={{
            fontWeight: 600,
            color: (theme) => (theme.palette.mode === 'dark' ? '#ecf0f1' : '#2c3e50')
          }}
        >
          Photo search
        </Typography>

        <IconButton
          size='small'
          onClick={onClose}
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? '#bdc3c7' : '#7f8c8d')
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <TextField
        placeholder='Search Unsplash for photos'
        variant='outlined'
        size='small'
        fullWidth
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            color: (theme) => (theme.palette.mode === 'dark' ? '#ecf0f1' : '#2c3e50'),
            '& fieldset': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#5a6c7d' : '#d1d5db')
            },
            '&:hover fieldset': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#7f8c8d' : '#9ca3af')
            }
          },
          '& .MuiInputBase-input::placeholder': {
            color: (theme) => (theme.palette.mode === 'dark' ? '#95a5a6' : '#6b7280'),
            opacity: 1
          }
        }}
        onChange={(event) => debounceSearchPhotos(event.target.value)}
      />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant='subtitle2'
          sx={{
            mb: 1.5,
            color: (theme) => (theme.palette.mode === 'dark' ? '#bdc3c7' : '#6b7280'),
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Suggested searches
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {suggestedSearches.map((search) => (
            <Button
              key={search}
              variant='outlined'
              size='small'
              sx={{
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 500,
                px: 2,
                py: 0.5,
                borderRadius: '16px',
                color: (theme) => (theme.palette.mode === 'dark' ? '#ecf0f1' : '#374151'),
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#5a6c7d' : '#d1d5db'),
                '&:hover': {
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#3c5a78' : '#e5e7eb'),
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#7f8c8d' : '#9ca3af')
                }
              }}
              onClick={() => onSearchQueryChange(search)}
            >
              {search}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Typography
          variant='subtitle2'
          sx={{
            mb: 0.5,
            color: (theme) => (theme.palette.mode === 'dark' ? '#bdc3c7' : '#6b7280'),
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Top photos
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            height: 'calc(100% - 40px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#f1f5f9')
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#5a6c7d' : '#cbd5e1'),
              borderRadius: '3px'
            }
          }}
        >
          {searchPhotos?.length > 0 &&
            searchPhotos.map((photo) => (
              <Box
                key={photo.id}
                component='img'
                src={photo.urls.thumb}
                alt={photo.description}
                sx={{
                  width: '100%',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => onUpdateCardCoverPhoto(photo.urls.thumb)}
              />
            ))}
        </Box>
      </Box>

      <Box sx={{ textAlign: 'right' }}>
        <Typography
          variant='caption'
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? '#95a5a6' : '#6b7280'),
            fontSize: '12px'
          }}
        >
          Photos from{' '}
          <MuiLink
            href='https://unsplash.com'
            target='_blank'
            rel='noopener noreferrer'
            sx={{
              color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'),
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none'
              }
            }}
          >
            Unsplash
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  )
}
