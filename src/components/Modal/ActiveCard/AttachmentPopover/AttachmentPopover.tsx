import { zodResolver } from '@hookform/resolvers/zod'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import CloseIcon from '@mui/icons-material/Close'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import TextFieldInput from '~/components/Form/TextFieldInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { AttachmentType } from '~/constants/type'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useAddCardAttachmentMutation } from '~/queries/cards'
import { useUploadDocumentMutation } from '~/queries/medias'
import {
  AddCardAttachmentBodyType,
  AddCardLinkAttachmentBody,
  AddCardLinkAttachmentBodyType,
  CardType
} from '~/schemas/card.schema'
import { updateCardInBoard } from '~/store/slices/board.slice'
import { updateActiveCard } from '~/store/slices/card.slice'
import { multipleDocumentFilesValidator } from '~/utils/validators'

const AttachmentPopover = forwardRef<HTMLButtonElement>((_, ref) => {
  const [anchorAttachmentPopoverElement, setAnchorAttachmentPopoverElement] = useState<HTMLElement | null>(null)
  const isAttachmentPopoverOpen = Boolean(anchorAttachmentPopoverElement)

  const popoverId = isAttachmentPopoverOpen ? 'attachment-popover' : undefined

  const toggleAttachmentPopover = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
    if (!anchorAttachmentPopoverElement) {
      setAnchorAttachmentPopoverElement(event.currentTarget)
    } else {
      setAnchorAttachmentPopoverElement(null)
      onReset()
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AddCardLinkAttachmentBodyType>({
    resolver: zodResolver(AddCardLinkAttachmentBody),
    defaultValues: { url: '', display_name: '' }
  })

  const onReset = () => {
    reset({ url: '', display_name: '' })
  }

  const dispatch = useAppDispatch()

  const { activeCard } = useAppSelector((state) => state.card)
  const { socket } = useAppSelector((state) => state.app)

  const [uploadDocumentMutation] = useUploadDocumentMutation()
  const [addCardAttachmentMutation] = useAddCardAttachmentMutation()

  const addCardLinkAttachment = handleSubmit((values) => {
    const payload = {
      type: AttachmentType.Link,
      link: {
        url: values.url,
        display_name: values.display_name,
        favicon_url: `https://www.google.com/s2/favicons?domain=${new URL(values.url).hostname}`
      },
      file: {}
    } as AddCardAttachmentBodyType

    addCardAttachmentMutation({
      card_id: activeCard?._id as string,
      body: payload
    }).then((res) => {
      if (!res.error) {
        const updatedCard = res.data?.result as CardType

        dispatch(updateActiveCard(updatedCard))
        dispatch(updateCardInBoard(updatedCard))

        onReset()
        setAnchorAttachmentPopoverElement(null)

        socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)
      }
    })
  })

  const uploadFileAttachment = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    const errorMessage = multipleDocumentFilesValidator(files as FileList)

    if (errorMessage) {
      toast.error(errorMessage, { position: 'top-center' })
      return
    }

    const formData = new FormData()

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('document', files[i])
      }
    }

    const uploadDocumentRes = await toast.promise(uploadDocumentMutation(formData).unwrap(), {
      pending: 'Uploading...',
      success: 'Upload successfully!',
      error: 'Upload failed!'
    })

    await Promise.all(
      uploadDocumentRes.result.map(async (file) => {
        const payload = {
          type: AttachmentType.File,
          file: {
            url: file.url,
            display_name: file.original_name,
            mime_type: file.mime_type,
            size: file.size,
            original_name: file.original_name
          },
          link: {}
        } as AddCardAttachmentBodyType

        const updatedCardRes = await addCardAttachmentMutation({
          card_id: activeCard?._id as string,
          body: payload
        }).unwrap()

        const updatedCard = updatedCardRes.result

        dispatch(updateActiveCard(updatedCard))
        dispatch(updateCardInBoard(updatedCard))

        socket?.emit('CLIENT_USER_UPDATED_CARD', updatedCard)
      })
    ).finally(() => {
      onReset()
      setAnchorAttachmentPopoverElement(null)
    })
  }

  return (
    <>
      <Button
        ref={ref}
        color='inherit'
        fullWidth
        onClick={toggleAttachmentPopover}
        sx={{
          p: '10px',
          fontWeight: '600',
          lineHeight: 'inherit',
          gap: '6px',
          justifyContent: 'flex-start',
          transition: 'none'
        }}
      >
        <AttachFileOutlinedIcon fontSize='small' />
        <span>Attachment</span>
      </Button>

      <Popover
        id={popoverId}
        open={isAttachmentPopoverOpen}
        anchorEl={anchorAttachmentPopoverElement}
        onClose={toggleAttachmentPopover}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              width: 350,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1
            }
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <IconButton size='small' sx={{ padding: 0 }}>
            <InfoOutlinedIcon />
          </IconButton>
          <Typography
            variant='h6'
            component='div'
            sx={{
              textAlign: 'center',
              flexGrow: 1
            }}
          >
            Attach
          </Typography>
          <IconButton onClick={toggleAttachmentPopover} size='small'>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant='subtitle2' gutterBottom sx={{ color: 'text.secondary' }}>
            Attach a file from your computer
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
            You can also drag and drop files to upload them.
          </Typography>
          <Button
            variant='contained'
            component='label'
            fullWidth
            sx={{ bgcolor: 'grey.300', color: 'black', '&:hover': { bgcolor: 'grey.400' } }}
          >
            Choose a file
            <VisuallyHiddenInput type='file' multiple onChange={uploadFileAttachment} />
          </Button>
        </Box>

        <Divider />

        <form onSubmit={addCardLinkAttachment}>
          <Stack direction='column' sx={{ mt: 1 }} spacing={2}>
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
              />
              <FieldErrorAlert errorMessage={errors.display_name?.message} />
            </Box>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
            <Button type='button' onClick={onReset} sx={{ color: 'text.primary' }}>
              Cancel
            </Button>
            <Button type='submit' variant='contained' color='info'>
              Insert
            </Button>
          </Box>
        </form>
      </Popover>
    </>
  )
})

export default AttachmentPopover
