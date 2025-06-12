import { zodResolver } from '@hookform/resolvers/zod'
import CancelIcon from '@mui/icons-material/Cancel'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import { CardAttachmentAction } from '~/constants/type'
import {
  CardAttachmentPayloadType,
  CardAttachmentType,
  UpdateCardLinkAttachmentBody,
  UpdateCardLinkAttachmentBodyType
} from '~/schemas/card.schema'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'

interface EditCardLinkAttachmentFormProps {
  attachment: CardAttachmentType
  onUpdateCardAttachment: (attachment: CardAttachmentPayloadType) => Promise<void>
  onBackToMenuActions: () => void
  onClose: () => void
}

export default function EditCardLinkAttachmentForm({
  attachment,
  onUpdateCardAttachment,
  onBackToMenuActions,
  onClose
}: EditCardLinkAttachmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateCardLinkAttachmentBodyType>({
    resolver: zodResolver(UpdateCardLinkAttachmentBody),
    defaultValues: { url: '', display_name: '' }
  })

  useEffect(() => {
    if (attachment) {
      const { url, display_name } = attachment.link
      reset({ url, display_name })
    }
  }, [attachment, reset])

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      action: CardAttachmentAction.Edit,
      type: attachment.type,
      link: values,
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
        <Stack direction='column' spacing={1}>
          <Box>
            <Typography variant='subtitle2' gutterBottom sx={{ color: 'text.secondary' }}>
              Search or paste a link
            </Typography>
            <TextFieldInput
              name='url'
              register={register}
              placeholder='Find recent links or paste a new link'
              error={!!errors['url']}
              size='small'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='start'>
                    <Tooltip title='Clear'>
                      <IconButton edge='end' onClick={() => reset({ url: '' })} sx={{ padding: 0 }}>
                        <CancelIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
            <FieldErrorAlert errorMessage={errors.url?.message} />
          </Box>

          <Box>
            <Typography variant='subtitle2' gutterBottom sx={{ color: 'text.secondary', mt: 1 }}>
              Display text (optional)
            </Typography>
            <TextFieldInput
              name='display_name'
              register={register}
              placeholder='Text to display'
              error={!!errors['display_name']}
              size='small'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='start'>
                    <Tooltip title='Clear text'>
                      <IconButton edge='end' onClick={() => reset({ display_name: '' })} sx={{ padding: 0 }}>
                        <CancelIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
            <FieldErrorAlert errorMessage={errors.display_name?.message} />
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <Button type='button' onClick={() => reset({ ...attachment.link })} sx={{ color: 'text.primary' }}>
            Cancel
          </Button>
          <Button type='submit' variant='contained' color='info'>
            Save
          </Button>
        </Box>
      </form>
    </Box>
  )
}
