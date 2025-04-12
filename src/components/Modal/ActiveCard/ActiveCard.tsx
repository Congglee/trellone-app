import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { toast } from 'react-toastify'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import CardActivitySection from '~/components/Modal/ActiveCard/CardActivitySection'
import CardDescriptionMdEditor from '~/components/Modal/ActiveCard/CardDescriptionMdEditor'
import CardUserGroup from '~/components/Modal/ActiveCard/CardUserGroup'
import { config } from '~/constants/config'
import { CardMemberAction } from '~/constants/type'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useUpdateCardMutation } from '~/queries/cards'
import { useUploadImageMutation } from '~/queries/medias'
import { CardMemberPayloadType, CommentType, UpdateCardBodyType } from '~/schemas/card.schema'
import { updateCardInBoard } from '~/store/slices/board.slice'
import { clearAndHideActiveCardModal, updateActiveCard } from '~/store/slices/card.slice'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import RemoveIcon from '@mui/icons-material/Remove'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

export default function ActiveCard() {
  const dispatch = useAppDispatch()
  const { isShowActiveCardModal, activeCard } = useAppSelector((state) => state.card)
  const { profile } = useAppSelector((state) => state.auth)

  const [updateCardMutation] = useUpdateCardMutation()
  const [uploadImageMutation] = useUploadImageMutation()

  const handleCloseModal = () => {
    dispatch(clearAndHideActiveCardModal())
  }

  const handleUpdateActiveCard = async (body: UpdateCardBodyType) => {
    const updateCardRes = await updateCardMutation({ id: activeCard?._id as string, body }).unwrap()

    const updatedCard = updateCardRes.result

    dispatch(updateActiveCard(updatedCard))

    dispatch(updateCardInBoard(updatedCard))

    return updatedCard
  }

  const onUpdateCardTitle = async (title: string) => {
    handleUpdateActiveCard({ title })
  }

  const onUpdateCardDescription = async (description: string) => {
    handleUpdateActiveCard({ description })
  }

  const onUploadCardCoverPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file && (file.size >= config.maxSizeUploadAvatar || !file.type.includes('image'))) {
      toast.error('Maximum file size is 3MB and file type must be an image.', { position: 'top-center' })
      return
    }

    const formData = new FormData()

    formData.append('image', file as File)

    const uploadImageRes = await uploadImageMutation(formData).unwrap()
    const imageUrl = uploadImageRes.result[0].url

    toast.promise(
      handleUpdateActiveCard({ cover_photo: imageUrl }).finally(() => {
        // Clear the input value after upload
        event.target.value = ''
      }),
      { pending: 'Uploading...', success: 'Upload successfully!' }
    )
  }

  const onAddCardComment = async (comment: CommentType) => {
    handleUpdateActiveCard({ comment })
  }

  const onUpdateCardMembers = async (member: CardMemberPayloadType) => {
    handleUpdateActiveCard({ member })
  }

  const onUpdateCardArchiveStatus = async (_destroy: boolean) => {
    handleUpdateActiveCard({ _destroy })
  }

  return (
    <Modal disableScrollLock open={isShowActiveCardModal} onClose={handleCloseModal} sx={{ overflowY: 'auto' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '50px auto',
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
        }}
      >
        <Box sx={{ position: 'absolute', top: '12px', right: '10px', cursor: 'pointer' }}>
          <CancelIcon color='error' sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover_photo && (
          <Box sx={{ mb: 4, position: 'relative' }}>
            <Box
              sx={{
                backgroundImage: `url(${activeCard.cover_photo})`,
                backgroundSize: 'contain',
                minHeight: '116px',
                maxHeight: '160px',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1d1f19' : '#f5f5f5')
              }}
            />
          </Box>
        )}

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />
          <ToggleFocusInput inputFontSize='22px' value={activeCard?.title} onChangeValue={onUpdateCardTitle} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

              <CardUserGroup cardMembers={activeCard?.members || []} onUpdateCardMembers={onUpdateCardMembers} />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography component='span' sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Description
                </Typography>
              </Box>

              <CardDescriptionMdEditor
                description={activeCard?.description as string}
                onUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography component='span' sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Activity
                </Typography>
              </Box>

              <CardActivitySection cardComments={activeCard?.comments || []} onAddCardComment={onAddCardComment} />
            </Box>
          </Grid>

          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction='column' spacing={1}>
              {activeCard?.members?.includes(profile?._id as string) ? (
                <SidebarItem
                  sx={{
                    color: 'error.light',
                    '&:hover': { color: 'error.light' }
                  }}
                  onClick={() =>
                    onUpdateCardMembers({
                      user_id: profile?._id as string,
                      action: CardMemberAction.Remove
                    })
                  }
                >
                  <ExitToAppIcon fontSize='small' />
                  Leave
                </SidebarItem>
              ) : (
                <SidebarItem
                  className='active'
                  onClick={() =>
                    onUpdateCardMembers({
                      user_id: profile?._id as string,
                      action: CardMemberAction.Add
                    })
                  }
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <PersonOutlineOutlinedIcon fontSize='small' />
                      <span>Join</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon fontSize='small' sx={{ color: '#27ae60' }} />
                    </Box>
                  </Box>
                </SidebarItem>
              )}

              <SidebarItem className='active' component='label'>
                <ImageOutlinedIcon fontSize='small' />
                Cover
                <VisuallyHiddenInput type='file' onChange={onUploadCardCoverPhoto} />
              </SidebarItem>

              <SidebarItem>
                <AttachFileOutlinedIcon fontSize='small' />
                Attachment
              </SidebarItem>
              <SidebarItem>
                <LocalOfferOutlinedIcon fontSize='small' />
                Labels
              </SidebarItem>
              <SidebarItem>
                <TaskAltOutlinedIcon fontSize='small' />
                Checklist
              </SidebarItem>
              <SidebarItem>
                <WatchLaterOutlinedIcon fontSize='small' />
                Dates
              </SidebarItem>
              <SidebarItem>
                <AutoFixHighOutlinedIcon fontSize='small' />
                Custom Fields
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction='column' spacing={1}>
              <SidebarItem>
                <AspectRatioOutlinedIcon fontSize='small' />
                Card Size
              </SidebarItem>
              <SidebarItem>
                <AddToDriveOutlinedIcon fontSize='small' />
                Google Drive
              </SidebarItem>
              <SidebarItem>
                <AddOutlinedIcon fontSize='small' />
                Add Power-Ups
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction='column' spacing={1}>
              <SidebarItem>
                <ArrowForwardOutlinedIcon fontSize='small' />
                Move
              </SidebarItem>
              <SidebarItem>
                <ContentCopyOutlinedIcon fontSize='small' />
                Copy
              </SidebarItem>
              <SidebarItem>
                <AutoAwesomeOutlinedIcon fontSize='small' />
                Make Template
              </SidebarItem>
              <SidebarItem
                className='active'
                component='label'
                onClick={() => onUpdateCardArchiveStatus(!activeCard?._destroy)}
              >
                {activeCard?._destroy ? (
                  <>
                    <RestartAltIcon fontSize='small' />
                    Send to Board
                  </>
                ) : (
                  <>
                    <ArchiveOutlinedIcon fontSize='small' />
                    Archive
                  </>
                )}
              </SidebarItem>
              {activeCard?._destroy && (
                <SidebarItem
                  sx={{
                    backgroundColor: (theme) => theme.palette.error.main,
                    color: (theme) => theme.palette.error.contrastText,
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? theme.palette.error.dark : theme.palette.error.light,
                      '&.active': {
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? theme.palette.error.dark : theme.palette.error.light,
                        color: (theme) => theme.palette.error.contrastText
                      }
                    }
                  }}
                >
                  <RemoveIcon fontSize='small' />
                  Delete
                </SidebarItem>
              )}
              <SidebarItem>
                <ShareOutlinedIcon fontSize='small' />
                Share
              </SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
