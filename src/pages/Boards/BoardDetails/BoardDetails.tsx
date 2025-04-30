import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DrawerHeader from '~/components/DrawerHeader'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Main from '~/components/Main'
import ActiveCard from '~/components/Modal/ActiveCard'
import NavBar from '~/components/NavBar'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import BoardBar from '~/pages/Boards/BoardDetails/components/BoardBar'
import BoardContent from '~/pages/Boards/BoardDetails/components/BoardContent'
import BoardDrawer from '~/pages/Boards/BoardDetails/components/BoardDrawer'
import BoardNotFound from '~/pages/Boards/BoardDetails/components/BoardNotFound'
import WorkspaceDrawer from '~/pages/Boards/BoardDetails/components/WorkspaceDrawer'
import { useMoveCardToDifferentColumnMutation, useUpdateBoardMutation } from '~/queries/boards'
import { useUpdateColumnMutation } from '~/queries/columns'
import { BoardResType } from '~/schemas/board.schema'
import { CardType } from '~/schemas/card.schema'
import { ColumnType } from '~/schemas/column.schema'
import { clearActiveBoard, getBoardDetails, updateActiveBoard, updateCardInBoard } from '~/store/slices/board.slice'
import { updateActiveCard } from '~/store/slices/card.slice'

export default function BoardDetails() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const isScreenBelowMedium = useMediaQuery(theme.breakpoints.down('md'))

  const [workspaceDrawerOpen, setWorkspaceDrawerOpen] = useState(true)
  const [boardDrawerOpen, setBoardDrawerOpen] = useState(false)

  const { boardId } = useParams()

  const dispatch = useAppDispatch()
  const { activeBoard, loading, error } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const [updateBoardMutation] = useUpdateBoardMutation()
  const [updateColumnMutation] = useUpdateColumnMutation()
  const [moveCardToDifferentColumnMutation] = useMoveCardToDifferentColumnMutation()

  useEffect(() => {
    if (boardId) {
      dispatch(getBoardDetails(boardId))

      // Join the board room to receive updates
      socket?.emit('CLIENT_JOIN_BOARD', boardId)
    }

    return () => {
      dispatch(clearActiveBoard())

      // Leave the board room when component unmounts
      if (boardId) {
        socket?.emit('CLIENT_LEAVE_BOARD', boardId)
      }
    }
  }, [dispatch, boardId, socket])

  // Listen for board and card updates from other users
  useEffect(() => {
    const onConnect = () => {
      console.log('Connected to socket server')
    }

    const onDisconnect = () => {
      console.log('Disconnected from socket server')
    }

    if (socket?.connected) {
      onConnect()
    }

    const onUpdateBoard = (board: BoardResType['result']) => {
      dispatch(updateActiveBoard(board))
    }

    const onUpdateCard = (card: CardType) => {
      dispatch(updateActiveCard(card))
      dispatch(updateCardInBoard(card))
    }

    socket?.on('SERVER_BOARD_UPDATED', onUpdateBoard)
    socket?.on('SERVER_CARD_UPDATED', onUpdateCard)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('SERVER_BOARD_UPDATED', onUpdateBoard)
      socket?.off('SERVER_CARD_UPDATED', onUpdateCard)
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
    }
  }, [dispatch, socket])

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

    // Emit socket event to notify other users about the column order update
    socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
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

    // Emit socket event to notify other users about the card order update
    socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
  }

  const onMoveCardToDifferentColumn = (
    currentCardId: string,
    prevColumnId: string,
    nextColumnId: string,
    dndOrderedColumns: ColumnType[]
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)

    const newActiveBoard = { ...activeBoard! }

    newActiveBoard.columns = dndOrderedColumns
    newActiveBoard.column_order_ids = dndOrderedColumnsIds

    dispatch(updateActiveBoard(newActiveBoard))

    let prevCardOrderIds = dndOrderedColumns.find((column) => column._id === prevColumnId)?.card_order_ids as string[]

    if (prevCardOrderIds[0]?.includes('placeholder-card')) {
      prevCardOrderIds = []
    }

    moveCardToDifferentColumnMutation({
      current_card_id: currentCardId,
      prev_column_id: prevColumnId,
      prev_card_order_ids: prevCardOrderIds,
      next_column_id: nextColumnId,
      next_card_order_ids: dndOrderedColumns.find((column) => column._id === nextColumnId)?.card_order_ids as string[]
    })

    // Emit socket event to notify other users about the card move to different column
    socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
  }

  if (loading === 'pending') {
    return <PageLoadingSpinner caption='Loading board...' />
  }

  if (error || !activeBoard) {
    return <BoardNotFound />
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <NavBar />
      <ActiveCard />
      <Box
        sx={{
          position: 'relative',
          backgroundImage: activeBoard.cover_photo ? `url(${activeBoard.cover_photo})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          bgcolor: isDarkMode ? 'grey.900' : 'primary.main'
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
          <WorkspaceDrawer open={workspaceDrawerOpen} onOpen={setWorkspaceDrawerOpen} boardId={boardId} />
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
              height: (theme) => theme.trellone.boardMainHeight,
              '&::-webkit-scrollbar-track': { m: 2 }
            }}
          >
            <DrawerHeader />
            {isScreenBelowMedium && <DrawerHeader />}
            <BoardContent
              board={activeBoard}
              onMoveColumns={onMoveColumns}
              onMoveCardInTheSameColumn={onMoveCardInTheSameColumn}
              onMoveCardToDifferentColumn={onMoveCardToDifferentColumn}
            />
          </Main>
          <BoardDrawer open={boardDrawerOpen} onOpen={setBoardDrawerOpen} />
        </Box>
      </Box>
    </Container>
  )
}
