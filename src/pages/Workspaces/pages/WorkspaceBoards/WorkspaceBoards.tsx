import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useMemo, useState, type ChangeEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useParams } from 'react-router-dom'
import NewBoardDialog from '~/components/Dialog/NewBoardDialog'
import BoardCard from '~/pages/Workspaces/components/BoardCard'
import NewBoardCard from '~/pages/Workspaces/components/NewBoardCard'
import { useGetWorkspaceQuery } from '~/queries/workspaces'
import { useDebounce } from '~/hooks/use-debounce'
import path from '~/constants/path'
import WorkspaceClosedBoards from '~/pages/Workspaces/components/WorkspaceClosedBoards'

export default function WorkspaceBoards() {
  const { workspaceId } = useParams()

  const [newBoardDialogOpen, setNewBoardDialogOpen] = useState(false)

  const { data: workspaceData, isLoading, isError } = useGetWorkspaceQuery(workspaceId!)
  const workspace = workspaceData?.result

  const boards = useMemo(() => (workspace?.boards || []).filter((board) => !board._destroy), [workspace?.boards])

  const hasClosedBoards = (workspace?.boards || []).some((board) => board._destroy)

  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [sortBy, setSortBy] = useState('most-recently-active')

  const debounceWorkspaceBoardsSearch = useDebounce((value: string) => {
    setDebouncedSearchText(value)
  }, 500)

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setSearchText(value)
    debounceWorkspaceBoardsSearch(value.trim().toLowerCase())
  }

  const filteredBoards = useMemo(() => {
    // 1) Filter by title (case-insensitive)
    const filtered = debouncedSearchText
      ? boards.filter((board) => (board.title || '').toLowerCase().includes(debouncedSearchText))
      : boards

    // 2) Sort by selected option
    const toTime = (val: unknown) => {
      if (!val) return 0

      if (val instanceof Date) return val.getTime()

      if (typeof val === 'string') {
        const t = Date.parse(val)
        return Number.isNaN(t) ? 0 : t
      }

      return 0
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'most-recently-active': {
          return toTime(b.updated_at as unknown) - toTime(a.updated_at as unknown)
        }

        case 'least-recently-active': {
          return toTime(a.updated_at as unknown) - toTime(b.updated_at as unknown)
        }

        case 'alphabetical': {
          const aTitle = (a.title || '').trim()
          const bTitle = (b.title || '').trim()
          return aTitle.localeCompare(bTitle, undefined, { sensitivity: 'base' })
        }

        case 'alphabetical-reverse': {
          const aTitle = (a.title || '').trim()
          const bTitle = (b.title || '').trim()
          return bTitle.localeCompare(aTitle, undefined, { sensitivity: 'base' })
        }

        default:
          return 0
      }
    })

    return sorted
  }, [boards, debouncedSearchText, sortBy])

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
      <Helmet>
        <title>{workspace?.title ? `${workspace.title} | Boards | Trellone` : 'Boards | Trellone'}</title>
        <meta
          name='description'
          content='Organize anything, together. Trellone is a collaboration tool that organizes your projects into boards.'
        />
      </Helmet>

      <Typography variant='h6' sx={{ mb: 2.5 }}>
        Boards
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'flex-end' }}
        justifyContent='space-between'
        sx={{ pr: 1, mb: 3.5 }}
      >
        <Box sx={{ minWidth: 240 }}>
          <Typography variant='caption' sx={{ display: 'block', mb: 0.75, fontWeight: 600, color: 'text.secondary' }}>
            Sort by
          </Typography>
          <Select
            size='small'
            fullWidth
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value || 'most-recently-active')}
          >
            <MenuItem value='most-recently-active'>Most recently active</MenuItem>
            <MenuItem value='least-recently-active'>Least recently active</MenuItem>
            <MenuItem value='alphabetical'>Alphabetical A-Z</MenuItem>
            <MenuItem value='alphabetical-reverse'>Alphabetical Z-A</MenuItem>
          </Select>
        </Box>

        <Box sx={{ minWidth: 280, ml: { md: 'auto' } }}>
          <Typography variant='caption' sx={{ display: 'block', mb: 0.75, fontWeight: 600, color: 'text.secondary' }}>
            Search
          </Typography>
          <TextField
            size='small'
            fullWidth
            placeholder='Search boards'
            value={searchText}
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'filter boards by title' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Stack>

      <Box sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          {isLoading ? (
            <>
              <NewBoardCard onNewBoardOpen={() => setNewBoardDialogOpen(true)} />
              {Array.from({ length: 3 }).map((_, index) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card variant='outlined' sx={{ height: 120 }}>
                    <Skeleton
                      animation='wave'
                      variant='rectangular'
                      width='100%'
                      height='100%'
                      sx={{
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300')
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </>
          ) : (
            <>
              <NewBoardCard onNewBoardOpen={() => setNewBoardDialogOpen(true)} />
              {filteredBoards.length > 0 && filteredBoards.map((board) => <BoardCard key={board._id} board={board} />)}
            </>
          )}
        </Grid>
        {hasClosedBoards && <WorkspaceClosedBoards workspaceId={workspaceId!} />}
      </Box>

      <NewBoardDialog
        newBoardDialogOpen={newBoardDialogOpen}
        onNewBoardDialogClose={() => setNewBoardDialogOpen(false)}
        defaultWorkspaceId={workspaceId}
      />
    </Box>
  )
}
