import Box from '@mui/material/Box'
import Card from '~/pages/Boards/BoardDetails/components/Card/Card'

export default function CardsList() {
  return (
    <Box
      sx={{
        p: '0 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) => ({
          xs: `calc(${theme.trellone.boardContentHeight} - ${theme.trellone.boardBarHeight} - ${theme.spacing(5)} - ${theme.trellone.columnHeaderHeight} - ${theme.trellone.columnFooterHeight})`,
          md: `calc(${theme.trellone.boardContentHeight} - ${theme.spacing(5)} - ${theme.trellone.columnHeaderHeight} - ${theme.trellone.columnFooterHeight})`
        }),
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
      }}
    >
      <Card />
      <Card tempHideMedia />
      <Card tempHideMedia />
      <Card tempHideMedia />
      <Card tempHideMedia />
      <Card tempHideMedia />
      <Card tempHideMedia />
    </Box>
  )
}
