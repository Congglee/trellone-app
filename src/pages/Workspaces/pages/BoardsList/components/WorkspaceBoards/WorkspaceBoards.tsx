import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import Grid from '@mui/material/Unstable_Grid2'
import { useState } from 'react'
import NewBoardDialog from '~/components/Dialog/NewBoardDialog'
import BoardCard from '~/pages/Workspaces/components/BoardCard'
import NewBoardCard from '~/pages/Workspaces/components/NewBoardCard'
import { WorkspaceResType } from '~/schemas/workspace.schema'

interface WorkspaceBoardsProps {
  workspace: WorkspaceResType['result']
  isLoading: boolean
}

export default function WorkspaceBoards({ workspace, isLoading }: WorkspaceBoardsProps) {
  const [newBoardOpen, setNewBoardOpen] = useState(false)

  const boards = workspace.boards || []

  const hasClosedBoards = boards.some((board) => board._destroy)

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid xs={12} sm={6} md={4} lg={3} key={index}>
            <Card variant='outlined' sx={{ height: 100 }}>
              <Skeleton animation='wave' variant='rectangular' width='100%' height='100%' />
            </Card>
          </Grid>
        ))}
        <NewBoardCard onNewBoardOpen={() => setNewBoardOpen(true)} />
      </Grid>
    )
  }

  return (
    <>
      <Box sx={{ pl: 1, mt: 1 }}>
        <Grid container spacing={2}>
          {boards?.length > 0 && boards.map((board) => <BoardCard key={board._id} board={board} />)}

          <NewBoardCard onNewBoardOpen={() => setNewBoardOpen(true)} />
        </Grid>

        {hasClosedBoards && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant='outlined'
              startIcon={<VisibilityOffIcon />}
              onClick={() => console.log('View all closed boards clicked')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'),
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#525252' : '#e0e0e0'),
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'transparent' : '#fafafa'),
                '&:hover': {
                  borderColor: (theme) => theme.palette.primary.main,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : '#e3f2fd'),
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              View all closed boards
            </Button>
          </Box>
        )}
      </Box>

      <NewBoardDialog open={newBoardOpen} onNewBoardClose={() => setNewBoardOpen(false)} />
    </>
  )
}
