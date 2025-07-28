import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import TextFieldInput from '~/components/Form/TextFieldInput'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { CreateWorkspaceBody, CreateWorkspaceBodyType } from '~/schemas/workspace.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isUnprocessableEntityError } from '~/utils/error-handlers'
import { useEffect } from 'react'
import { useAddWorkspaceMutation } from '~/queries/workspaces'

interface NewWorkspaceDialogProps {
  open: boolean
  onNewWorkspaceClose: () => void
}

export default function NewWorkspaceDialog({ open, onNewWorkspaceClose }: NewWorkspaceDialogProps) {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateWorkspaceBodyType>({
    resolver: zodResolver(CreateWorkspaceBody),
    defaultValues: { title: '', description: '' }
  })

  const [addWorkspaceMutation, { isError, error }] = useAddWorkspaceMutation()

  const onSubmit = handleSubmit((values) => {
    addWorkspaceMutation(values).then((res) => {
      if (!res.error) {
        onNewWorkspaceClose()
      }
    })
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<CreateWorkspaceBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof CreateWorkspaceBodyType, {
            type: value.type,
            message: value.msg
          })
        }
      }
    }
  }, [isError, error, setError])

  return (
    <Dialog
      scroll='body'
      open={open}
      onClose={onNewWorkspaceClose}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
      PaperProps={{
        sx: {
          width: { xs: 'auto', sm: 520 }
        }
      }}
    >
      <DialogTitle align='center'>Create Workspace</DialogTitle>

      <Divider variant='middle' />

      <Box sx={{ textAlign: 'center', margin: '28px 0px 8px 0px' }}>
        <img src='/board.svg' alt='Create a new workspace' />
      </Box>

      <form onSubmit={onSubmit}>
        <DialogContent>
          <DialogContentText sx={{ opacity: 0, visibility: 'hidden', height: 0 }}>
            To create a workspace, please fill in the required fields below.
          </DialogContentText>

          <Box sx={{ marginTop: '1em' }}>
            <TextFieldInput name='title' register={register} label='Workspace Title' error={!!errors['title']} />
            <Typography
              variant='caption'
              sx={{
                display: 'block',
                mt: 0.5,
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              This is the name of your company, team or organization.
            </Typography>
            <FieldErrorAlert errorMessage={errors.title?.message} />
          </Box>

          <Box sx={{ marginTop: '1em' }}>
            <TextFieldInput
              name='description'
              register={register}
              label='Workspace Description (Optional)'
              multiline
              rows={4}
              error={!!errors['description']}
            />
            <Typography
              variant='caption'
              sx={{
                display: 'block',
                mt: 0.5,
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              Get your members on board with a few words about your Workspace.
            </Typography>
            <FieldErrorAlert errorMessage={errors.description?.message} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ py: 2.5, px: 3 }}>
          <Button fullWidth type='submit' variant='contained' className='interceptor-loading'>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
