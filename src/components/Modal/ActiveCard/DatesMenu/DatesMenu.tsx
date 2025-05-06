import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const [dateValue, setDateValue] = useState<Date | null>(null)

  useEffect(() => {
    if (dueDate) {
      const date = new Date(dueDate)
      setDateValue(date)
    } else {
      setDateValue(null)
    }
  }, [dueDate])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const updateCardDueDate = () => {
    onUpdateCardDueDate(dateValue, isCompleted as boolean)
    handleClose()
  }

  return (
    <>
      <Button
        color='inherit'
        fullWidth
        id='basic-button-dates'
        aria-controls={open ? 'basic-menu-dates' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          p: '10px',
          lineHeight: 'inherit',
          gap: '6px',
          justifyContent: 'flex-start'
        }}
      >
        <PersonOutlineOutlinedIcon fontSize='small' />
        <span>Dates</span>
      </Button>
      <Menu
        id='basic-menu-dates'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
              onCancel: handleClose,
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
