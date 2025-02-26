import Stack from '@mui/material/Stack'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Typography from '@mui/material/Typography'

interface LogoProps {
  color?: string
}

export default function Logo({ color }: LogoProps) {
  return (
    <Stack height='44px' direction='row' alignItems='center'>
      <DashboardIcon
        sx={{
          color: (theme) => (color ? color : theme.palette.primary.main)
        }}
        fontSize='small'
      />
      <Typography
        sx={{
          color: (theme) => (color ? color : theme.palette.secondary.main)
        }}
        pl={0.5}
        variant='button'
      >
        Trello
      </Typography>
    </Stack>
  )
}
