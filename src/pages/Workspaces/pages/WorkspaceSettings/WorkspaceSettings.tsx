import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import WorkspaceAvatar from '~/components/Workspace/WorkspaceAvatar'
import SEO from '~/components/SEO'
import path from '~/constants/path'
import { WorkspacePermission } from '~/constants/permissions'
import { WorkspaceVisibility as WorkspaceVisibilityEnum } from '~/constants/type'
import { useWorkspacePermission } from '~/hooks/use-permissions'
import WorkspaceLogo from '~/pages/Workspaces/components/WorkspaceLogo'
import EditWorkspaceDialog from '~/pages/Workspaces/pages/WorkspaceHome/components/EditWorkspaceDialog'
import DeleteWorkspace from '~/pages/Workspaces/pages/WorkspaceSettings/components/DeleteWorkspace'
import WorkspaceVisibility from '~/pages/Workspaces/pages/WorkspaceSettings/components/WorkspaceVisibility'
import { useGetWorkspaceQuery } from '~/queries/workspaces'
import { WorkspaceVisibilityType } from '~/schemas/workspace.schema'

export default function WorkspaceSettings() {
  const { workspaceId } = useParams()

  const [editWorkspaceOpen, setEditWorkspaceOpen] = useState(false)

  const { data: workspaceData, isLoading, isError } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result

  const { hasPermission, canDeleteWorkspace } = useWorkspacePermission(workspace)

  if (isError) {
    return <Navigate to={path.boardsList} />
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        width: { xs: '100vw', sm: '100%' }
      }}
    >
      <SEO
        title={workspace?.title ? `${workspace.title} - Settings` : 'Workspace Settings'}
        description='Manage workspace settings, visibility, and advanced actions in Trellone.'
        noIndex
        noFollow
      />

      <Typography variant='h6' sx={{ mb: 2.5 }}>
        Workspace settings
      </Typography>

      <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 2 }}>
        {isLoading ? (
          <>
            <Skeleton variant='rounded' width={48} height={48} />
            <Box sx={{ minWidth: 0 }}>
              <Stack direction='row' alignItems='center' spacing={1}>
                <Skeleton variant='text' width={180} height={28} />
              </Stack>
              <Stack direction='row' alignItems='center' spacing={0.75} sx={{ mt: 0.5 }}>
                <Skeleton variant='text' width={80} height={20} />{' '}
              </Stack>
            </Box>
          </>
        ) : (
          <>
            {hasPermission(WorkspacePermission.ManageWorkspace) ? (
              <WorkspaceLogo workspace={workspace!} size={{ width: 48, height: 48 }} />
            ) : (
              <WorkspaceAvatar
                title={workspace?.title as string}
                logo={workspace?.logo}
                size={{ width: 48, height: 48 }}
              />
            )}

            <Box sx={{ minWidth: 0 }}>
              <Stack direction='row' alignItems='center' spacing={1}>
                <Typography
                  variant='h2'
                  sx={{
                    fontWeight: 600,
                    fontSize: 20,
                    mr: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: { xs: 220, sm: 420 }
                  }}
                  title={workspace?.title}
                >
                  {workspace?.title}
                </Typography>
                {hasPermission(WorkspacePermission.ManageWorkspace) && (
                  <IconButton size='small' aria-label='edit workspace name' onClick={() => setEditWorkspaceOpen(true)}>
                    <EditOutlinedIcon fontSize='small' />
                  </IconButton>
                )}
              </Stack>

              <Stack direction='row' alignItems='center' spacing={0.5}>
                {workspace?.visibility === WorkspaceVisibilityEnum.Private && (
                  <>
                    <LockOutlinedIcon sx={{ fontSize: 14 }} />
                    <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {workspace.visibility}
                    </Typography>
                  </>
                )}

                {workspace?.visibility === WorkspaceVisibilityEnum.Public && (
                  <>
                    <PublicOutlinedIcon sx={{ fontSize: 14 }} />
                    <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {workspace.visibility}
                    </Typography>
                  </>
                )}
              </Stack>
            </Box>
          </>
        )}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Typography variant='subtitle2' sx={{ display: 'block', mb: 1, fontWeight: 700, color: 'text.primary' }}>
          Workspace visibility
        </Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent='space-between'
          useFlexGap
          spacing={{ xs: 2, md: 8 }}
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'),
            border: (theme) =>
              `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]}`
          }}
        >
          <Stack direction='row' spacing={1.25} sx={{ flex: 1 }}>
            {workspace?.visibility === WorkspaceVisibilityEnum.Private && (
              <>
                <LockOutlinedIcon color='error' sx={{ fontSize: 18 }} />
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  This Workspace is private. It&apos;s not indexed or visible to those outside the Workspace.
                </Typography>
              </>
            )}

            {workspace?.visibility === WorkspaceVisibilityEnum.Public && (
              <>
                <PublicOutlinedIcon color='success' sx={{ fontSize: 18 }} />
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  This Workspace is public. It&apos;s visible to anyone with the link and will show up in search engines
                  like Google. Only those invited to the Workspace can add and edit Workspace boards.
                </Typography>
              </>
            )}
          </Stack>

          <WorkspaceVisibility
            isDisabled={!hasPermission(WorkspacePermission.ManageWorkspace)}
            workspaceId={workspaceId as string}
            workspaceVisibility={workspace?.visibility as WorkspaceVisibilityType}
          />
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-start' } }}>
        <DeleteWorkspace
          workspaceId={workspaceId as string}
          workspaceTitle={workspace?.title as string}
          affectedBoardIds={workspace?.boards.map((board) => board._id) || []}
          canDeleteWorkspace={canDeleteWorkspace}
        />
      </Box>

      {workspace && (
        <EditWorkspaceDialog
          open={editWorkspaceOpen}
          onEditWorkspaceClose={() => setEditWorkspaceOpen(false)}
          workspace={workspace}
        />
      )}
    </Box>
  )
}
