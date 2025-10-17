import AcUnitIcon from '@mui/icons-material/AcUnit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import FaceIcon from '@mui/icons-material/Face'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import PaletteIcon from '@mui/icons-material/Palette'
import BrushIcon from '@mui/icons-material/Brush'
import PhishingIcon from '@mui/icons-material/Phishing'
import PublicIcon from '@mui/icons-material/Public'
import VolcanoIcon from '@mui/icons-material/Volcano'
import WavesIcon from '@mui/icons-material/Waves'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useAppSelector } from '~/lib/redux/hooks'
import { useUpdateBoardMutation } from '~/queries/boards'
import { useAppDispatch } from '~/lib/redux/hooks'
import { updateActiveBoard } from '~/store/slices/board.slice'

const GRADIENT_COLORS = [
  { id: 1, from: '#E0F7FA', to: '#FFFFFF', icon: CropSquareIcon },
  { id: 2, color: '#29B6F6', icon: AcUnitIcon },
  { id: 3, color: '#0D47A1', icon: WavesIcon },
  { id: 4, from: '#7E57C2', to: '#3949AB', icon: PhishingIcon },
  { id: 5, from: '#BA68C8', to: '#C2185B', icon: PaletteIcon },
  { id: 6, from: '#F57C00', to: '#FFA726', icon: BrushIcon },
  { id: 7, color: '#EC407A', icon: LocalFloristIcon },
  { id: 8, from: '#66BB6A', to: '#26A69A', icon: PublicIcon },
  { id: 9, color: '#263238', icon: FaceIcon },
  { id: 10, from: '#A12C0B', to: '#212121', icon: VolcanoIcon }
]

const SOLID_COLORS = ['#0077CC', '#E69939', '#5CB85C', '#C94B4B', '#8869A5', '#D9538C', '#5AC46C', '#00AACC', '#808080']

export default function ColorPicker() {
  const [anchorColorPickerElement, setAnchorColorPickerElement] = useState<HTMLElement | null>(null)

  const isColorPickerOpen = Boolean(anchorColorPickerElement)
  const colorPickerId = isColorPickerOpen ? 'color-picker-popover' : undefined

  const handleColorPickerOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorColorPickerElement(event.currentTarget)
  }

  const handleColorPickerClose = () => {
    setAnchorColorPickerElement(null)
  }

  const [selectedColor, setSelectedColor] = useState<string>('')

  const [updateBoardMutation] = useUpdateBoardMutation()

  const dispatch = useAppDispatch()
  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)

    updateBoardMutation({
      id: activeBoard?._id as string,
      body: { background_color: color, cover_photo: '' }
    }).then((res) => {
      if (!res.error) {
        const newActiveBoard = { ...activeBoard! }

        newActiveBoard.background_color = color
        newActiveBoard.cover_photo = ''

        dispatch(updateActiveBoard(newActiveBoard))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', newActiveBoard.workspace_id)
      }
    })
  }

  return (
    <>
      <Button
        variant='contained'
        size='small'
        color='primary'
        fullWidth
        startIcon={<PaletteIcon />}
        onClick={handleColorPickerOpen}
      >
        Colors
      </Button>

      <Popover
        id={colorPickerId}
        open={isColorPickerOpen}
        anchorEl={anchorColorPickerElement}
        onClose={handleColorPickerClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              mt: 1.5
            }
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 2 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
              Colors
            </Typography>
            <IconButton size='small' onClick={handleColorPickerClose}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {GRADIENT_COLORS.map((item) => {
              const Icon = item.icon
              const isGradient = 'from' in item && 'to' in item
              const bgStyle = isGradient
                ? { background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)` }
                : { backgroundColor: item.color }

              const colorValue = isGradient ? `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)` : item.color!

              return (
                <Grid xs={6} key={item.id}>
                  <Box
                    onClick={() => handleColorSelect(colorValue)}
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 70,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease',
                      ...bgStyle,
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'scale(1.02)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <Icon
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        fontSize: '1.2rem',
                        color: (theme) => theme.palette.grey[900],
                        textShadow: '0 1px 4px rgba(255,255,255,0.7)',
                        filter: 'drop-shadow(0 1px 3px rgba(255,255,255,0.55))'
                      }}
                    />
                    {selectedColor === colorValue && (
                      <CheckIcon
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '2rem',
                          color: 'white',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={1}>
            {SOLID_COLORS.map((color, index) => (
              <Grid xs={3} key={index}>
                <Box
                  onClick={() => handleColorSelect(color)}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 50,
                    borderRadius: 1.5,
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: selectedColor === color ? 'primary.main' : 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'scale(1.05)',
                      boxShadow: 2
                    }
                  }}
                >
                  {selectedColor === color && (
                    <CheckIcon
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '1.5rem',
                        color: 'white',
                        filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))'
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </>
  )
}
