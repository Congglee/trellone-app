import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { useAppSelector } from '~/lib/redux/hooks'
import { useUpdateWorkspaceMutation } from '~/queries/workspaces'
import { UpdateWorkspaceBody, UpdateWorkspaceBodyType, WorkspaceType } from '~/schemas/workspace.schema'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

interface EditWorkspaceDialogProps {
  open: boolean
  onEditWorkspaceClose: () => void
  workspace: WorkspaceType
}

export default function EditWorkspaceDialog({ open, onEditWorkspaceClose, workspace }: EditWorkspaceDialogProps) {
  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateWorkspaceBodyType>({
    resolver: zodResolver(UpdateWorkspaceBody),
    defaultValues: { title: '', description: '' }
  })

  const [updateWorkspaceMutation, { isError, error }] = useUpdateWorkspaceMutation()

  const { socket } = useAppSelector((state) => state.app)

  useEffect(() => {
    if (workspace && open) {
      const { title, description } = workspace
      reset({ title, description })
    }
  }, [workspace, reset, open])

  const onSubmit = handleSubmit((values) => {
    updateWorkspaceMutation({ id: workspace._id, body: values }).then((res) => {
      if (!res.error) {
        onEditWorkspaceClose()
        toast.success(res.data?.message || 'Workspace updated successfully')

        socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', workspace._id)

        const workspaceId = workspace?._id
        const affectedBoardIds = workspace?.boards.map((board) => board._id) || []

        for (const boardId of affectedBoardIds) {
          socket?.emit('CLIENT_USER_UPDATED_WORKSPACE', workspaceId, boardId)
        }
      }
    })
  })

  useEffect(() => {
    if (isError && isUnprocessableEntityError<UpdateWorkspaceBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof UpdateWorkspaceBodyType, {
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
      onClose={onEditWorkspaceClose}
      aria-labelledby='edit-workspace-dialog-title'
      aria-describedby='edit-workspace-dialog-description'
      PaperProps={{
        sx: {
          width: { xs: 'auto', sm: 520 }
        }
      }}
    >
      <DialogTitle align='center' id='edit-workspace-dialog-title'>
        Edit Workspace
      </DialogTitle>

      <Divider variant='middle' />

      <form onSubmit={onSubmit}>
        <DialogContent>
          <DialogContentText
            id='edit-workspace-dialog-description'
            sx={{ opacity: 0, visibility: 'hidden', height: 0 }}
          >
            Edit your workspace details below.
          </DialogContentText>

          <Box sx={{ marginTop: '1em' }}>
            <TextFieldInput name='title' register={register} label='Name' error={!!errors['title']} required autoFocus />
            <FieldErrorAlert errorMessage={errors.title?.message} />
          </Box>

          <Box sx={{ marginTop: '1em' }}>
            <TextFieldInput
              name='description'
              register={register}
              label='Description (optional)'
              multiline
              rows={4}
              error={!!errors['description']}
            />
            <FieldErrorAlert errorMessage={errors.description?.message} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ py: 2.5, px: 3, gap: 1 }}>
          <Button
            onClick={onEditWorkspaceClose}
            variant='outlined'
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            className='interceptor-loading'
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
