import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

interface CardDueDateProps {
  cardDueDate?: Date | null
  isCompleted?: boolean | null
  onUpdateCardDueDateAndStatus: (dueDate: Date | null, isCompleted: boolean | null) => void
}

export default function CardDueDate({ cardDueDate, isCompleted, onUpdateCardDueDateAndStatus }: CardDueDateProps) {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.only('xs'))

  const [dateValue, setDateValue] = useState<Date | null>(null)
  const [checked, setChecked] = useState(false)
  const [isOverdue, setIsOverdue] = useState<boolean>(false)

  useEffect(() => {
    if (cardDueDate) {
      const now = new Date()
      const date = new Date(cardDueDate)

      setDateValue(date)
      setIsOverdue(date < now && !isCompleted)
    } else {
      setDateValue(null)
      setIsOverdue(false)
    }
  }, [cardDueDate, isCompleted])

  useEffect(() => {
    setChecked(isCompleted || false)
  }, [isCompleted])

  const handleUpdateCardDueDate = (newValue: Date | null) => {
    setDateValue(newValue)
    onUpdateCardDueDateAndStatus(newValue, checked)
  }

  const handleCardCompletionStatusToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = event.target.checked
    setChecked(newCheckedState)
    onUpdateCardDueDateAndStatus(dateValue, newCheckedState)
  }

  const handleRemoveCardDueDate = () => {
    onUpdateCardDueDateAndStatus(null, false)
  }

  const getChipColor = () => {
    if (checked) return 'success'
    if (isOverdue) return 'error'
    return 'default'
  }

  const getChipLabel = () => {
    if (checked) return 'Completed'
    if (isOverdue) return 'Overdue'
    return ''
  }

  return (
    <Box sx={{ mb: 3, width: 'fit-content' }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='caption'>Due Date</Typography>
        <Tooltip title='Remove due date' placement='top' arrow>
          <IconButton onClick={handleRemoveCardDueDate}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack direction='row'>
        <MobileDateTimePicker
          ampm
          orientation={isSmallScreen ? 'portrait' : 'landscape'}
          value={dateValue}
          onAccept={(newValue) => handleUpdateCardDueDate(newValue)}
          slotProps={{
            textField: {
              multiline: true,
              maxRows: 2,
              size: 'small',
              InputProps: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <Checkbox
                      onClick={(e) => e.stopPropagation()}
                      onChange={handleCardCompletionStatusToggle}
                      checked={checked}
                      inputProps={{ 'aria-label': 'controlled' }}
                      size='small'
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment sx={{ ml: 0 }} position='end'>
                    <Chip
                      onClick={(e) => e.stopPropagation()}
                      sx={{ height: 'auto', ml: 2 }}
                      color={getChipColor()}
                      label={getChipLabel()}
                    />
                  </InputAdornment>
                )
              }
            }
          }}
        />
      </Stack>
    </Box>
  )
}
