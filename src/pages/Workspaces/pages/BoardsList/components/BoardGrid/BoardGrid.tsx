import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import Grid from '@mui/material/Unstable_Grid2'
import { useState } from 'react'
import NewBoardDialog from '~/components/Dialog/NewBoardDialog'
import BoardCard from '~/pages/Workspaces/components/BoardCard'
import NewBoardCard from '~/pages/Workspaces/components/NewBoardCard'
import { WorkspaceType } from '~/schemas/workspace.schema'

interface BoardGridProps {
  workspace: WorkspaceType
  isLoading: boolean
  showNewBoardCard?: boolean
}

export default function BoardGrid({ workspace, isLoading, showNewBoardCard = true }: BoardGridProps) {
  const [newBoardOpen, setNewBoardOpen] = useState(false)

  const boards = workspace.boards || []

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid xs={12} sm={6} md={4} lg={3} key={index}>
            <Card variant='outlined' sx={{ height: 120 }}>
              <Skeleton animation='wave' variant='rectangular' width='100%' height='100%' />
            </Card>
          </Grid>
        ))}
        {showNewBoardCard && <NewBoardCard onNewBoardOpen={() => setNewBoardOpen(true)} />}
      </Grid>
    )
  }

  return (
    <>
      <Box sx={{ pl: 1, mt: 1 }}>
        <Grid container spacing={2}>
          {boards?.length > 0 && boards.map((board) => <BoardCard key={board._id} board={board} />)}

          {showNewBoardCard && <NewBoardCard onNewBoardOpen={() => setNewBoardOpen(true)} />}
        </Grid>
      </Box>

      <NewBoardDialog
        open={newBoardOpen}
        onNewBoardClose={() => setNewBoardOpen(false)}
        defaultWorkspaceId={workspace._id}
      />
    </>
  )
}
