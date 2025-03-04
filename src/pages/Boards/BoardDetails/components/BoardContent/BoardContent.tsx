import Box from '@mui/material/Box'
import ColumnsList from '~/pages/Boards/BoardDetails/components/ColumnsList'

export default function BoardContent() {
  return (
    <Box
      sx={{
        width: '100%',
        p: 1.25,
        height: (theme) => ({
          xs: `calc(100vh - ${theme.trellone.navBarHeight} - 2 * ${theme.trellone.boardBarHeight})`,
          md: theme.trellone.boardContentHeight
        })
      }}
    >
      <ColumnsList />
    </Box>
  )
}
