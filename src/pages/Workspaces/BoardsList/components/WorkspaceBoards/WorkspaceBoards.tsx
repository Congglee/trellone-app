import AddIcon from '@mui/icons-material/Add'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Link } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import randomColor from 'randomcolor'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import NewBoardDialog from '~/components/Dialog/NewBoardDialog'
import { WorkspaceSchema } from '~/schemas/workspace.schema'
import { z } from 'zod'

interface WorkspaceBoardsProps {
  workspace: z.infer<typeof WorkspaceSchema>
  isLoading: boolean
}

export default function WorkspaceBoards({ workspace, isLoading }: WorkspaceBoardsProps) {
  const [newBoardOpen, setNewBoardOpen] = useState(false)

  const boards = workspace.boards || []

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
          {boards?.length > 0 &&
            boards.map((board) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={board._id}>
                <Link
                  sx={{
                    display: 'block',
                    transition: 'opacity 0.2s ease',
                    '&:hover': {
                      opacity: 0.8,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    borderRadius: '8px'
                  }}
                  component={NavLink}
                  to={`/boards/${board._id}`}
                >
                  <Card
                    variant='outlined'
                    sx={{
                      height: 100,
                      backgroundImage: board.cover_photo ? `url(${board.cover_photo})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {!board.cover_photo && (
                      <Box
                        sx={{
                          width: '100%',
                          height: '30px',
                          backgroundColor: randomColor(),
                          opacity: 0.7
                        }}
                      />
                    )}
                    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography
                        variant='body1'
                        fontWeight={700}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                          color: board.cover_photo ? 'white' : 'inherit',
                          textShadow: board.cover_photo ? '0 1px 2px rgba(0,0,0,0.7)' : 'none'
                        }}
                      >
                        {board?.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}

          <NewBoardCard onNewBoardOpen={() => setNewBoardOpen(true)} />
        </Grid>

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
      </Box>

      <NewBoardDialog open={newBoardOpen} onNewBoardClose={() => setNewBoardOpen(false)} />
    </>
  )
}

function NewBoardCard({ onNewBoardOpen }: { onNewBoardOpen: () => void }) {
  return (
    <Grid xs={12} sm={6} md={4} lg={3}>
      <Card
        variant='outlined'
        sx={{
          height: 100,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.2s ease',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#f8f9fa'),
          borderStyle: 'dashed',
          borderWidth: 2,
          borderRadius: '8px',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#525252' : '#dee2e6'),
          '&:hover': {
            opacity: 0.8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderColor: (theme) => theme.palette.primary.main,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : '#e3f2fd')
          }
        }}
        onClick={onNewBoardOpen}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AddIcon
            sx={{
              fontSize: 32,
              color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2')
            }}
          />
          <Typography
            variant='body2'
            fontWeight={600}
            sx={{
              color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'),
              textAlign: 'center'
            }}
          >
            Create new board
          </Typography>
        </Box>
      </Card>
    </Grid>
  )
}
