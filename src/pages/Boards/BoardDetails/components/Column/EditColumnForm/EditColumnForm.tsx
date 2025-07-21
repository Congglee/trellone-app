import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import TextFieldInput from '~/components/Form/TextFieldInput'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import { ColumnType, UpdateColumnBody, UpdateColumnBodyType } from '~/schemas/column.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useUpdateColumnMutation } from '~/queries/columns'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import cloneDeep from 'lodash/cloneDeep'
import { updateActiveBoard } from '~/store/slices/board.slice'

interface EditColumnFormProps {
  column: ColumnType
  onBackToMenuActions: () => void
  onClose: () => void
}

export default function EditColumnForm({ column, onBackToMenuActions, onClose }: EditColumnFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateColumnBodyType>({
    resolver: zodResolver(UpdateColumnBody),
    defaultValues: { title: '' }
  })

  useEffect(() => {
    if (column) {
      const { title } = column
      reset({ title })
    }
  }, [column, reset])

  const { activeBoard } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)
  const dispatch = useAppDispatch()

  const [updateColumnMutation] = useUpdateColumnMutation()

  const onSubmit = handleSubmit(async (values) => {
    const newActiveBoard = cloneDeep(activeBoard)
    const columnToUpdate = newActiveBoard?.columns?.find((col) => col._id === column._id)

    if (columnToUpdate) {
      columnToUpdate.title = values.title as string
    }

    dispatch(updateActiveBoard(newActiveBoard))

    updateColumnMutation({
      id: column._id,
      body: { title: values.title }
    })

    // Emit socket event to notify other users about the column title update
    socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
  })

  return (
    <Box sx={{ p: 1.5, width: '100%', minWidth: 300, maxWidth: 300 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton size='small' onClick={onBackToMenuActions}>
          <ArrowBackIcon fontSize='small' />
        </IconButton>
        <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
          Edit column
        </Typography>
        <IconButton size='small' onClick={onClose}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      <form onSubmit={onSubmit}>
        <Box>
          <Typography variant='subtitle2' gutterBottom sx={{ color: 'text.secondary' }}>
            Title
          </Typography>
          <TextFieldInput
            name='title'
            register={register}
            placeholder='Enter column title'
            error={!!errors['title']}
            size='small'
          />
          <FieldErrorAlert errorMessage={errors.title?.message} />
        </Box>

        <Button type='submit' variant='contained' color='info' fullWidth sx={{ mt: 2 }}>
          Save
        </Button>
      </form>
    </Box>
  )
}
