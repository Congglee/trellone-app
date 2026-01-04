import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { BOARD_DEFAULT_COVER_PHOTO } from '~/constants/mock-data'
import { BoardVisibility } from '~/constants/type'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useAppSelector } from '~/lib/redux/hooks'
import { useAddBoardMutation } from '~/queries/boards'
import { useGetWorkspacesQuery } from '~/queries/workspaces'
import { CreateBoardBody, CreateBoardBodyType } from '~/schemas/board.schema'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

interface NewBoardDialogProps {
  newBoardDialogOpen: boolean
  onNewBoardDialogClose: () => void
  defaultWorkspaceId?: string
}

export default function NewBoardDialog({
  newBoardDialogOpen,
  onNewBoardDialogClose,
  defaultWorkspaceId
}: NewBoardDialogProps) {
  const {
    register,
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateBoardBodyType>({
    resolver: zodResolver(CreateBoardBody),
    defaultValues: {
      title: '',
      description: '',
      visibility: BoardVisibility.Public,
      workspace_id: defaultWorkspaceId || ''
    }
  })

  const queryConfig = useQueryConfig()

  const { socket } = useAppSelector((state) => state.app)

  const { data: workspacesData } = useGetWorkspacesQuery(queryConfig)
  const workspaces = workspacesData?.result.workspaces || []

  const [addBoardMutation, { isError, error }] = useAddBoardMutation()

  const navigate = useNavigate()

  const onSubmit = handleSubmit((values) => {
    const payload = { ...values, cover_photo: BOARD_DEFAULT_COVER_PHOTO }

    addBoardMutation(payload).then((res) => {
      if (!res.error) {
        const board = res.data?.result

        socket?.emit('CLIENT_USER_CREATED_WORKSPACE_BOARD', values.workspace_id)

        navigate(`/boards/${board?._id}`)
      }
    })
  })

  useEffect(() => {
    if (defaultWorkspaceId && newBoardDialogOpen) {
      reset({
        title: '',
        description: '',
        visibility: BoardVisibility.Public,
        workspace_id: defaultWorkspaceId || ''
      })
    }
  }, [defaultWorkspaceId, reset, newBoardDialogOpen])

  useEffect(() => {
    if (isError && isUnprocessableEntityError<CreateBoardBodyType>(error)) {
      const formError = error.data.errors

      if (formError) {
        for (const [key, value] of Object.entries(formError)) {
          setError(key as keyof CreateBoardBodyType, {
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
      open={newBoardDialogOpen}
      onClose={onNewBoardDialogClose}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
      PaperProps={{
        sx: {
          width: { xs: 'auto', sm: 450 }
        }
      }}
    >
      <DialogTitle align='center'>Create Board</DialogTitle>

      <Divider variant='middle' />

      <div style={{ textAlign: 'center', margin: '28px 0px 8px 0px' }}>
        <img src='/board.svg' alt='Create a new board' />
      </div>

      <form onSubmit={onSubmit}>
        <DialogContent>
          <DialogContentText sx={{ opacity: 0, visibility: 'hidden', height: 0 }}>
            To create a board, please fill in the required fields below.
          </DialogContentText>

          <Box sx={{ marginTop: '1em' }}>
            <TextFieldInput name='title' register={register} label='Board Title' error={!!errors['title']} />
            <FieldErrorAlert errorMessage={errors.title?.message} />
          </Box>

          <Box sx={{ marginTop: '1em' }}>
            <TextFieldInput
              name='description'
              register={register}
              label='Board Description'
              multiline
              rows={4}
              error={!!errors['description']}
            />
            <FieldErrorAlert errorMessage={errors.description?.message} />
          </Box>

          <Box sx={{ marginTop: '1em' }}>
            <FormControl fullWidth>
              <FormLabel id='board-visibility-radio-buttons-group' sx={{ fontSize: '0.875rem' }}>
                Board Visibility
              </FormLabel>
              <Controller
                name='visibility'
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    aria-labelledby='board-visibility-radio-buttons-group'
                    onChange={(_, value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControlLabel
                      value={BoardVisibility.Public}
                      control={<Radio size='small' />}
                      label='Public'
                      labelPlacement='start'
                      sx={{ ml: 0 }}
                    />
                    <FormControlLabel
                      value={BoardVisibility.Private}
                      control={<Radio size='small' />}
                      label='Private'
                      labelPlacement='start'
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
            <FieldErrorAlert errorMessage={errors.description?.message} />
          </Box>

          <Box sx={{ marginTop: '1em' }}>
            <FormControl fullWidth error={!!errors.workspace_id}>
              <InputLabel id='workspace-select-label'>Workspace</InputLabel>
              <Controller
                name='workspace_id'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId='workspace-select-label'
                    id='workspace-select'
                    label='Workspace'
                    value={field.value || ''}
                    onChange={(event) => field.onChange(event.target.value)}
                  >
                    {workspaces.map((workspace) => (
                      <MenuItem key={workspace._id} value={workspace._id}>
                        {workspace.title}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <FieldErrorAlert errorMessage={errors.workspace_id?.message} />
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
