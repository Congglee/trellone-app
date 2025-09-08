import SearchIcon from '@mui/icons-material/Search'
import { alpha, SxProps } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import { useDebounce } from '~/hooks/use-debounce'
import { useGetBoardsQuery } from '~/queries/boards'
import { BoardResType } from '~/schemas/board.schema'

interface AutoCompleteSearchBoardProps {
  styles?: SxProps
}

export default function AutoCompleteSearchBoard({ styles }: AutoCompleteSearchBoardProps) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState('')

  const navigate = useNavigate()

  const { data: boardsData, isLoading } = useGetBoardsQuery(
    {
      page: DEFAULT_PAGINATION_PAGE,
      limit: 50,
      keyword
    },
    { skip: keyword.length === 0 }
  )

  const boards = boardsData?.result.boards || []

  const handleInputSearchChange = (event: React.SyntheticEvent<Element, Event>) => {
    const value = (event.target as HTMLInputElement).value
    if (!value) return

    setKeyword(value)
  }

  // Wrap the `handleBoardSelection` function above with useDebounceFn and set a delay of about 2 seconds after typing stops before executing the function
  const debounceSearchBoard = useDebounce(handleInputSearchChange, 2000)

  const handleBoardSelection = (
    _event: React.SyntheticEvent<Element, Event>,
    selectedBoard: BoardResType['result'] | null
  ) => {
    if (selectedBoard) {
      navigate(`/boards/${selectedBoard._id}`)
    }
  }

  return (
    <Autocomplete
      sx={{ width: 220, ...styles }}
      id='asynchronous-search-board'
      noOptionsText={!boards ? 'Type to search board...' : 'No board found!'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(board) => board.title}
      options={boards || []}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      loading={isLoading}
      onInputChange={debounceSearchBoard}
      onChange={handleBoardSelection}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Type to search...'
          size='small'
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {isLoading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.15),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.25)
            }
          }}
        />
      )}
    />
  )
}
