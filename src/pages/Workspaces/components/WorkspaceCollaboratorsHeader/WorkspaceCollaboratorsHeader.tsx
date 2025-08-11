import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

interface WorkspaceCollaboratorsHeaderProps {
  heading: string
  description?: string
}

export default function WorkspaceCollaboratorsHeader({ heading, description = '' }: WorkspaceCollaboratorsHeaderProps) {
  return (
    <>
      <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2} sx={{ mb: 1.5 }}>
        <Typography variant='h6' sx={{ fontSize: 18 }}>
          {heading}
        </Typography>
      </Stack>

      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        {description}
      </Typography>

      <Divider />
    </>
  )
}
