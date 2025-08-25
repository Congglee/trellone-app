import AppsIcon from '@mui/icons-material/Apps'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import TrelloneIcon from '~/assets/trello.svg?react'
import AutoCompleteSearchBoard from '~/components/NavBar/AutoCompleteSearchBoard'
import Create from '~/components/NavBar/Create'
import ModeSelect from '~/components/NavBar/ModeSelect'
import path from '~/constants/path'

interface MenuDrawerProps {
  onToggleDrawer: (open: boolean) => void
}

export default function MenuDrawer({ onToggleDrawer }: MenuDrawerProps) {
  return (
    <Box sx={{ width: { xs: 250, sm: 350 }, height: '100%' }} role='presentation'>
      <List
        sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }}
        component='nav'
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader component='div' id='nested-list-subheader' sx={{ py: 1.5 }}>
            <Link to={path.home} onClick={(e) => e.stopPropagation()}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SvgIcon
                  component={TrelloneIcon}
                  inheritViewBox
                  fontSize='small'
                  sx={{ color: (theme) => theme.palette.primary.main }}
                />
                <Typography
                  variant='body1'
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: (theme) => theme.palette.secondary.main }}
                >
                  Trellone
                </Typography>
              </Box>
            </Link>

            <IconButton
              size='small'
              sx={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              onClick={() => onToggleDrawer(false)}
            >
              <CloseIcon />
            </IconButton>
          </ListSubheader>
        }
      >
        <Divider sx={{ my: 0.25 }} />

        <ListItemButton component={Link} to={path.boardsList}>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary='All Boards' />
        </ListItemButton>

        <ListItem>
          <Create styles={{ minWidth: '100%' }} />
        </ListItem>

        <ListItem>
          <ModeSelect styles={{ minWidth: '100%' }} />
        </ListItem>

        <ListItem>
          <AutoCompleteSearchBoard styles={{ minWidth: '100%' }} />
        </ListItem>
      </List>
    </Box>
  )
}
