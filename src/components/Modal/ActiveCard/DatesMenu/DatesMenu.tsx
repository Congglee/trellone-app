import DateRangeIcon from '@mui/icons-material/DateRange'
import { useMediaQuery } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import { useTheme } from '@mui/material/styles'
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker'
import { useEffect, useState } from 'react'

interface CardDatesMenuProps {
  dueDate?: Date | null
  isCompleted?: boolean | null
  onUpdateCardDueDate: (due_date: Date | null, is_completed: boolean | null) => Promise<void>
}

export default function DatesMenu({ dueDate, onUpdateCardDueDate, isCompleted }: CardDatesMenuProps) {
  const theme = useTheme()
  const isScreenMdAndAbove = useMediaQuery(theme.breakpoints.only('xs'))

  const [anchorDatesMenuElement, setAnchorDatesMenuElement] = useState<null | HTMLElement>(null)

  const isDatesMenuOpen = Boolean(anchorDatesMenuElement)

  const [dateValue, setDateValue] = useState<Date | null>(null)

  useEffect(() => {
    if (dueDate) {
      const date = new Date(dueDate)
      setDateValue(date)
    } else {
      setDateValue(null)
    }
  }, [dueDate])

  const handleDatesMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorDatesMenuElement(event.currentTarget)
  }

  const handleDatesMenuClose = () => {
    setAnchorDatesMenuElement(null)
  }

  const updateCardDueDate = () => {
    onUpdateCardDueDate(dateValue, isCompleted as boolean)
    handleDatesMenuClose()
  }

  return (
    <>
      <Button
        color='inherit'
        fullWidth
        id='basic-button-dates'
        aria-controls={isDatesMenuOpen ? 'basic-menu-dates' : undefined}
        aria-haspopup='true'
        aria-expanded={isDatesMenuOpen ? 'true' : undefined}
        onClick={handleDatesMenuClick}
        sx={{
          p: '10px',
          fontWeight: '600',
          lineHeight: 'inherit',
          gap: '6px',
          justifyContent: 'flex-start',
          transition: 'none'
        }}
      >
        <DateRangeIcon fontSize='small' />
        <span>Dates</span>
      </Button>

      <Menu
        id='basic-menu-dates'
        anchorEl={anchorDatesMenuElement}
        open={isDatesMenuOpen}
        onClose={handleDatesMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-dates',
          disablePadding: true
        }}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <StaticDateTimePicker
          ampm
          value={dateValue}
          onChange={(newValue) => setDateValue(newValue)}
          slotProps={{
            layout: { sx: { backgroundColor: 'inherit' } },
            actionBar: {
              actions: ['today', 'cancel', 'accept'],
              // @ts-expect-error - MUI types don't properly expose the onAccept and onCancel props
              onAccept: updateCardDueDate,
              onCancel: handleDatesMenuClose,
              sx: { justifyContent: isScreenMdAndAbove ? 'flex-start' : 'flex-end' }
            }
          }}
          orientation={isScreenMdAndAbove ? 'portrait' : 'landscape'}
          defaultValue={new Date()}
        />
      </Menu>
    </>
  )
}
