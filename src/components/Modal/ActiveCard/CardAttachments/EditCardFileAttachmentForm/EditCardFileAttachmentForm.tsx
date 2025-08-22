import { zodResolver } from '@hookform/resolvers/zod'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useUpdateCardAttachmentMutation } from '~/queries/cards'
import {
  CardAttachmentType,
  UpdateCardFileAttachmentBody,
  UpdateCardFileAttachmentBodyType
} from '~/schemas/card.schema'
import { updateCardInBoard } from '~/store/slices/board.slice'
import { updateActiveCard } from '~/store/slices/card.slice'

interface EditCardFileAttachmentFormProps {
  attachment: CardAttachmentType
  onBackToMenuActions: () => void
  onClose: () => void
}

export default function EditCardFileAttachmentForm({
  attachment,
  onBackToMenuActions,
  onClose
}: EditCardFileAttachmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateCardFileAttachmentBodyType>({
    resolver: zodResolver(UpdateCardFileAttachmentBody),
    defaultValues: { display_name: '' }
  })

  useEffect(() => {
    if (attachment) {
      const { display_name } = attachment.file
      reset({ display_name })
    }
  }, [attachment, reset])

  const dispatch = useAppDispatch()

  const { activeCard } = useAppSelector((state) => state.card)
  const { socket } = useAppSelector((state) => state.app)

  const [updateCardAttachmentMutation] = useUpdateCardAttachmentMutation()

  const onSubmit = handleSubmit(async (values) => {
    if (!values.display_name || values.display_name.trim() === '') {
      return
    }

    const payload = {
      type: attachment.type,
      file: { ...attachment.file, display_name: values.display_name }
    }

    const updatedCardRes = await updateCardAttachmentMutation({
      card_id: activeCard?._id as string,
      attachment_id: attachment.attachment_id,
      body: payload
    }).unwrap()

    const updatedCard = updatedCardRes.result

    dispatch(updateActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))

    // Emit socket event to broadcast the card update to other users
    socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)

    onClose()
  })

  return (
    <Box sx={{ p: 1.5, width: '100%', minWidth: 300, maxWidth: 300 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton size='small' onClick={onBackToMenuActions}>
          <ArrowBackIcon fontSize='small' />
        </IconButton>
        <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
          Edit attachment
        </Typography>
        <IconButton size='small' onClick={onClose}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      <form onSubmit={onSubmit}>
        <Box>
          <Typography variant='subtitle2' gutterBottom sx={{ color: 'text.secondary' }}>
            File name
          </Typography>
          <TextFieldInput
            name='display_name'
            register={register}
            placeholder='Text to display'
            error={!!errors['display_name']}
            size='small'
          />
          <FieldErrorAlert errorMessage={errors.display_name?.message} />
        </Box>

        <Button type='submit' variant='contained' color='info' fullWidth sx={{ mt: 2 }}>
          Save
        </Button>
      </form>
    </Box>
  )
}
