import { Link } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import randomColor from 'randomcolor'
import { createSearchParams, NavLink } from 'react-router-dom'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useGetBoardsQuery } from '~/queries/boards'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import path from '~/constants/path'
import Stack from '@mui/material/Stack'

export default function WorkspaceBoards() {
  const queryConfig = useQueryConfig()
  const { data: boardsData, isLoading } = useGetBoardsQuery(queryConfig)

  const boards = boardsData?.result.boards || []
  const totalPage = boardsData?.result.total_page || 0

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid xs={12} sm={6} md={4} lg={3} key={index}>
            <Card variant='outlined' sx={{ height: 100 }}>
              <Skeleton animation='wave' variant='rectangular' width='100%' height='100%' />
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <>
      <Grid container spacing={2}>
        {boards?.length > 0 &&
          boards.map((board) => (
            <Grid xs={12} sm={6} md={4} lg={3} key={board._id}>
              <Link
                sx={{
                  display: 'block',
                  transition: 'transform 0.2s ease',
                  '&:hover': { boxShadow: '0 0 10px 5px' },
                  borderRadius: '4px'
                }}
                component={NavLink}
                to={`/boards/${board._id}`}
              >
                <Card
                  variant='outlined'
                  sx={{
                    height: 100,
                    backgroundImage: board.cover_photo ? `url(${board.cover_photo})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!board.cover_photo && (
                    <Box
                      sx={{
                        width: '100%',
                        height: '30px',
                        backgroundColor: randomColor(),
                        opacity: 0.5
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography
                      variant='body1'
                      fontWeight={700}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {board?.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}

        {boards?.length === 0 && (
          <Typography variant='body1' fontWeight={700}>
            No boards found. Create a new board to get started.
          </Typography>
        )}
      </Grid>

      {totalPage > 0 && (
        <Stack direction='row' alignItems='center' justifyContent='flex-end' sx={{ my: 4 }}>
          <Pagination
            size='large'
            color='secondary'
            showFirstButton
            showLastButton
            count={totalPage}
            page={Number(queryConfig.page)}
            renderItem={(item) => (
              <PaginationItem
                component={NavLink}
                to={{
                  pathname: path.boardsList,
                  search: createSearchParams(queryConfig).toString()
                }}
                {...item}
              />
            )}
          />
        </Stack>
      )}
    </>
  )
}
