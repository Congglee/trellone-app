import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { alpha } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { useState } from 'react'

interface SearchBarProps {
  styles?: React.CSSProperties
}

export default function SearchBar({ styles }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('')

  return (
    <TextField
      id='outlined-search'
      label='Search...'
      type='text'
      size='small'
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon className='search-icon' />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position='end'>
            <CloseIcon
              fontSize='small'
              sx={{
                color: searchValue ? 'inherit' : 'transparent',
                cursor: searchValue ? 'pointer' : 'default'
              }}
              onClick={() => setSearchValue('')}
            />
          </InputAdornment>
        )
      }}
      sx={{
        minWidth: '120px',
        maxWidth: '180px',
        backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.15),
        '&:hover': {
          backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.25)
        },
        ...styles
      }}
    />
  )
}
