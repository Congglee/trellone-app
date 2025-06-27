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
import { CardAttachmentAction } from '~/constants/type'
import {
  CardAttachmentPayloadType,
  CardAttachmentType,
  UpdateCardFileAttachmentBody,
  UpdateCardFileAttachmentBodyType
} from '~/schemas/card.schema'

interface EditCardFileAttachmentFormProps {
  attachment: CardAttachmentType
  onUpdateCardAttachment: (attachment: CardAttachmentPayloadType) => Promise<void>
  onBackToMenuActions: () => void
  onClose: () => void
}

export default function EditCardFileAttachmentForm({
  attachment,
  onUpdateCardAttachment,
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

  const onSubmit = handleSubmit(async (values) => {
    if (!values.display_name || values.display_name.trim() === '') {
      return
    }

    const payload = {
      action: CardAttachmentAction.Edit,
      type: attachment.type,
      file: { ...attachment.file, display_name: values.display_name },
      attachment_id: attachment.attachment_id
    }

    onUpdateCardAttachment(payload).finally(() => {
      onClose()
    })
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
