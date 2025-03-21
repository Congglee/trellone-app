import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DrawerHeader from '~/components/DrawerHeader'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Main from '~/components/Main'
import NavBar from '~/components/NavBar'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import BoardBar from '~/pages/Boards/BoardDetails/components/BoardBar'
import BoardContent from '~/pages/Boards/BoardDetails/components/BoardContent'
import BoardDrawer from '~/pages/Boards/BoardDetails/components/BoardDrawer'
import WorkspaceDrawer from '~/pages/Boards/BoardDetails/components/WorkspaceDrawer'
import { useUpdateBoardMutation } from '~/queries/boards'
import { useUpdateColumnMutation } from '~/queries/columns'
import { CardType } from '~/schemas/card.schema'
import { ColumnType } from '~/schemas/column.schema'
import { getBoardDetails, updateActiveBoard } from '~/store/slices/board.slice'

export default function BoardDetails() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const isScreenBelowMedium = useMediaQuery(theme.breakpoints.down('md'))

  const [workspaceDrawerOpen, setWorkspaceDrawerOpen] = useState(true)
  const [boardDrawerOpen, setBoardDrawerOpen] = useState(false)

  const { boardId } = useParams()

  const dispatch = useAppDispatch()
  const { activeBoard, loading } = useAppSelector((state) => state.board)

  const [updateBoardMutation] = useUpdateBoardMutation()
  const [updateColumnMutation] = useUpdateColumnMutation()

  useEffect(() => {
    dispatch(getBoardDetails(boardId!))
  }, [dispatch, boardId])

  const onMoveColumns = (dndOrderedColumns: ColumnType[]) => {
    const dndOrderedCardsIds = dndOrderedColumns.map((column) => column._id)

    const newActiveBoard = { ...activeBoard! }
    newActiveBoard.columns = dndOrderedColumns
    newActiveBoard.column_order_ids = dndOrderedCardsIds

    dispatch(updateActiveBoard(newActiveBoard))

    updateBoardMutation({
      id: newActiveBoard._id,
      body: { column_order_ids: newActiveBoard.column_order_ids }
    })
  }

  const onMoveCardInTheSameColumn = (dndOrderedCards: CardType[], dndOrderedCardsIds: string[], columnId: string) => {
    const newActiveBoard = cloneDeep(activeBoard)
    const columnToUpdate = newActiveBoard?.columns?.find((column) => column._id === columnId)

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.card_order_ids = dndOrderedCardsIds
    }

    dispatch(updateActiveBoard(newActiveBoard))

    updateColumnMutation({
      id: columnId,
      body: { card_order_ids: dndOrderedCardsIds }
    })
  }

  if (loading === 'pending') {
    return <PageLoadingSpinner caption='Loading board...' />
  }

  if (!activeBoard) {
    return null
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <NavBar />
      <Box
        sx={{
          position: 'relative',
          backgroundImage: 'url(https://images6.alphacoders.com/138/thumbbig-1386838.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {isDarkMode && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              mixBlendMode: 'multiply'
            }}
          />
        )}
        <Box sx={{ display: 'flex' }}>
          <WorkspaceDrawer open={workspaceDrawerOpen} onOpen={setWorkspaceDrawerOpen} />
          <BoardBar
            workspaceDrawerOpen={workspaceDrawerOpen}
            onWorkspaceDrawerOpen={setWorkspaceDrawerOpen}
            boardDrawerOpen={boardDrawerOpen}
            onBoardDrawerOpen={setBoardDrawerOpen}
            board={activeBoard}
          />
          <Main
            workspaceDrawerOpen={workspaceDrawerOpen}
            boardDrawerOpen={boardDrawerOpen}
            sx={{
              overflowX: 'auto',
              overflowY: 'hidden',
              height: theme.trellone.boardMainHeight
            }}
          >
            <DrawerHeader />
            {isScreenBelowMedium && <DrawerHeader />}
            <BoardContent
              board={activeBoard}
              onMoveColumns={onMoveColumns}
              onMoveCardInTheSameColumn={onMoveCardInTheSameColumn}
            />
          </Main>
          <BoardDrawer open={boardDrawerOpen} onOpen={setBoardDrawerOpen} />
        </Box>
      </Box>
    </Container>
  )
}
