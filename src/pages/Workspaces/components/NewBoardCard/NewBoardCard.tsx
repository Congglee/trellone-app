import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'

interface NewBoardCardProps {
  onNewBoardOpen: () => void
}

export default function NewBoardCard({ onNewBoardOpen }: NewBoardCardProps) {
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
