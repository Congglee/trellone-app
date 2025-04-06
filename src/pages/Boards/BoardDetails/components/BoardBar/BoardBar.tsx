import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import MenuIcon from '@mui/icons-material/Menu'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import AppBar from '~/components/AppBar'
import BoardUserGroup from '~/pages/Boards/BoardDetails/components/BoardUserGroup'
import InviteBoardUser from '~/pages/Boards/BoardDetails/components/InviteBoardUser'
import { BoardResType } from '~/schemas/board.schema'
import { capitalizeFirstLetter } from '~/utils/formatters'

interface BoardBarProps {
  workspaceDrawerOpen: boolean
  onWorkspaceDrawerOpen: (open: boolean) => void
  boardDrawerOpen: boolean
  onBoardDrawerOpen: (open: boolean) => void
  board: BoardResType['result']
}

const MENU_STYLES = {
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'text.primary'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  },
  fontSize: '0.875rem',
  fontWeight: 500
}

export default function BoardBar({
  workspaceDrawerOpen,
  onWorkspaceDrawerOpen,
  boardDrawerOpen,
  onBoardDrawerOpen,
  board
}: BoardBarProps) {
  return (
    <AppBar
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 40%)' : 'rgb(255 255 255 / 40%)'),
        top: 'auto',
        zIndex: 999
      }}
      position='fixed'
      workspaceDrawerOpen={workspaceDrawerOpen}
      boardDrawerOpen={boardDrawerOpen}
    >
      <Toolbar
        sx={{
          minHeight: (theme) => theme.trellone.boardBarHeight,
          backdropFilter: 'blur(4px)',
          justifyContent: 'space-between',
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          py: 1.25,
          overflowX: 'auto'
        }}
        variant='dense'
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color='inherit'
            aria-label='open workspace drawer'
            onClick={() => onWorkspaceDrawerOpen(true)}
            edge='start'
            sx={{ ...(workspaceDrawerOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Tooltip title={board.description}>
            <Chip sx={MENU_STYLES} icon={<SpaceDashboardIcon />} label={board.title} clickable />
          </Tooltip>
          <Tooltip title={capitalizeFirstLetter('public')}>
            <IconButton color='inherit'>
              <VpnLockIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Add to Drive'>
            <IconButton color='inherit'>
              <AddToDriveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Automation'>
            <IconButton color='inherit'>
              <BoltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Filters'>
            <Chip sx={MENU_STYLES} icon={<FilterListIcon />} label='Filters' clickable />
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
          <InviteBoardUser boardId={board._id} />
          <BoardUserGroup />
          <IconButton
            color='inherit'
            aria-label='open board drawer'
            onClick={() => onBoardDrawerOpen(true)}
            edge='end'
            sx={{ ...(boardDrawerOpen && { display: 'none' }) }}
          >
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
