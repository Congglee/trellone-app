import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
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
import { BoardType } from '~/constants/type'
import { useAddBoardMutation } from '~/queries/boards'
import { CreateBoardBody, CreateBoardBodyType } from '~/schemas/board.schema'
import { isUnprocessableEntityError } from '~/utils/error-handlers'

interface NewBoardDialogProps {
  open: boolean
  onNewBoardClose: () => void
}

export default function NewBoardDialog({ open, onNewBoardClose }: NewBoardDialogProps) {
  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateBoardBodyType>({
    resolver: zodResolver(CreateBoardBody),
    defaultValues: { title: '', description: '', type: BoardType.Public }
  })

  const [addBoardMutation, { isError, error }] = useAddBoardMutation()

  const navigate = useNavigate()

  const onReset = () => {
    reset({ title: '', description: '', type: BoardType.Public })
  }

  const onSubmit = handleSubmit((values) => {
    addBoardMutation(values).then((res) => {
      if (!res.error) {
        const board = res.data?.result
        navigate(`/boards/${board?._id}`)
      }
    })
  })

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
      open={open}
      onClose={onNewBoardClose}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
    >
      <DialogTitle align='center'>Create Board</DialogTitle>

      <Divider variant='middle' />

      <div style={{ textAlign: 'center', margin: '28px 0px 8px 0px' }}>
        <img src='/board.svg' alt='' />
      </div>

      <form onSubmit={onSubmit}>
        <DialogContent sx={{ width: { xs: '100%', sm: 400 } }}>
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
              <FormLabel id='board-type-radio-buttons-group' sx={{ fontSize: '0.875rem' }}>
                Board Type
              </FormLabel>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    aria-labelledby='board-type-radio-buttons-group'
                    onChange={(event, value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControlLabel
                      value={BoardType.Public}
                      control={<Radio size='small' />}
                      label='Public'
                      labelPlacement='start'
                      sx={{ ml: 0 }}
                    />
                    <FormControlLabel
                      value={BoardType.Private}
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
            <FormControl fullWidth>
              <InputLabel id='workspace-select-label'>Workspace *</InputLabel>
              <Select
                labelId='workspace-select-label'
                id='workspace-select'
                label='Workspace*'
                disabled
                sx={{ '& .MuiSelect-select.Mui-disabled': { cursor: 'not-allowed' } }}
              >
                <MenuItem value='project-management'>Project Management</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button type='button' onClick={onReset}>
            Cancel
          </Button>
          <Button type='submit' variant='contained' className='interceptor-loading'>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
