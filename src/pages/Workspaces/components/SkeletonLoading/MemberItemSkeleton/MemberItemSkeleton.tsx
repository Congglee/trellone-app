import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

export default function MemberItemSkeleton() {
  return (
    <Paper variant='outlined' sx={{ p: 1.25, borderRadius: 1, bgcolor: 'transparent' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent='space-between'
        gap={2}
      >
        <Stack direction='row' alignItems='center' gap={1.5} sx={{ minWidth: 0 }}>
          <Skeleton variant='circular' width={36} height={36} animation='wave' sx={{ flexShrink: 0 }} />

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Skeleton
              variant='text'
              width={Math.floor(Math.random() * 60) + 100}
              height={24}
              animation='wave'
              sx={{ fontSize: '1rem', mb: 0.25, transform: 'scale(1, 0.8)' }}
            />
            <Skeleton
              variant='text'
              width={Math.floor(Math.random() * 40) + 70}
              height={20}
              animation='wave'
              sx={{ fontSize: '0.875rem', transform: 'scale(1, 0.8)' }}
            />
          </Box>
        </Stack>

        <Stack direction='row' alignItems='center' gap={1} flexWrap='wrap'>
          <Skeleton
            variant='rectangular'
            width={80}
            height={32}
            animation='wave'
            sx={{ borderRadius: 1, flexShrink: 0 }}
          />
          <Skeleton
            variant='rectangular'
            width={80}
            height={32}
            animation='wave'
            sx={{ borderRadius: 1, flexShrink: 0 }}
          />
          <Skeleton
            variant='rectangular'
            width={80}
            height={32}
            animation='wave'
            sx={{ borderRadius: 1, flexShrink: 0 }}
          />
        </Stack>
      </Stack>
    </Paper>
  )
}
