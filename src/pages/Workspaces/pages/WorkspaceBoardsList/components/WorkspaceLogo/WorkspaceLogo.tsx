import UploadIcon from '@mui/icons-material/Upload'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { toast } from 'react-toastify'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import { useUploadImageMutation } from '~/queries/medias'
import { useUpdateWorkspaceMutation } from '~/queries/workspaces'
import { WorkspaceResType } from '~/schemas/workspace.schema'
import { singleFileValidator } from '~/utils/validators'

interface WorkspaceLogoProps {
  workspace: WorkspaceResType['result']
}

export default function WorkspaceLogo({ workspace }: WorkspaceLogoProps) {
  const [anchorLogoPopoverElement, setAnchorLogoPopoverElement] = useState<HTMLElement | null>(null)
  const isLogoPopoverOpen = Boolean(anchorLogoPopoverElement)

  const logoPopoverId = isLogoPopoverOpen ? 'logo-popover' : undefined

  const toggleLogoPopover = (event: React.MouseEvent<HTMLElement>) => {
    if (!anchorLogoPopoverElement) {
      setAnchorLogoPopoverElement(event.currentTarget)
    } else {
      setAnchorLogoPopoverElement(null)
    }
  }

  const [uploadImageMutation] = useUploadImageMutation()
  const [updateWorkspaceMutation] = useUpdateWorkspaceMutation()

  const uploadWorkspaceLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    const errorMessage = singleFileValidator(file as File)

    if (errorMessage) {
      toast.error(errorMessage, { position: 'top-center' })
      return
    }

    const formData = new FormData()

    formData.append('image', file as File)

    const uploadImageRes = await toast.promise(uploadImageMutation(formData).unwrap(), {
      pending: 'Uploading...',
      success: 'Upload successfully!',
      error: 'Upload failed!'
    })
    const imageUrl = uploadImageRes.result[0].url

    await updateWorkspaceMutation({ id: workspace._id, body: { logo: imageUrl } })

    event.target.value = ''
  }

  return (
    <>
      <Box
        onClick={toggleLogoPopover}
        sx={{
          position: 'relative',
          display: 'inline-block',
          cursor: 'pointer',
          overflow: 'hidden',
          '&:hover .hover-overlay': {
            opacity: 1
          }
        }}
      >
        <WorkspaceAvatar title={workspace?.title as string} logo={workspace?.logo} size={{ width: 80, height: 80 }} />
        <Box
          className='hover-overlay'
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            opacity: 0,
            transition: 'opacity 0.2s ease'
          }}
        >
          <Typography
            variant='caption'
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: '12px',
              textAlign: 'center'
            }}
          >
            Change
          </Typography>
        </Box>
      </Box>

      <Popover
        id={logoPopoverId}
        open={isLogoPopoverOpen}
        anchorEl={anchorLogoPopoverElement}
        onClose={toggleLogoPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 2,
              boxShadow: (theme) => theme.shadows[8]
            }
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <Typography
            variant='h6'
            component='div'
            sx={{
              textAlign: 'center',
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Change logo
          </Typography>
        </Box>

        <Button
          variant='contained'
          fullWidth
          startIcon={<UploadIcon />}
          component='label'
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            borderRadius: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : '#0052cc'),
            color: 'white',
            '&:hover': {
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#405A73' : '#004bb5'),
              boxShadow: (theme) => theme.shadows[4]
            },
            transition: 'all 0.2s ease'
          }}
        >
          Upload a new logo
          <VisuallyHiddenInput type='file' accept='image/*' onChange={uploadWorkspaceLogo} />
        </Button>
      </Popover>
    </>
  )
}
