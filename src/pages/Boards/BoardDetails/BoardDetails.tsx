import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import DrawerHeader from '~/components/DrawerHeader'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Main from '~/components/Main'
import ActiveCard from '~/components/Modal/ActiveCard'
import NavBar from '~/components/NavBar'
import { BoardRole } from '~/constants/type'
import { useBoardPermission } from '~/hooks/use-permissions'
import { useQueryConfig } from '~/hooks/use-query-config'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import BoardBar from '~/pages/Boards/BoardDetails/components/BoardBar'
import BoardClosedBanner from '~/pages/Boards/BoardDetails/components/BoardClosedBanner'
import BoardContent from '~/pages/Boards/BoardDetails/components/BoardContent'
import BoardDrawer from '~/pages/Boards/BoardDetails/components/BoardDrawer'
import BoardErrorView from '~/pages/Boards/BoardDetails/components/BoardErrorView'
import WorkspaceDrawer from '~/pages/Boards/BoardDetails/components/WorkspaceDrawer'
import { boardApi, useUpdateBoardMutation } from '~/queries/boards'
import { useMoveCardToDifferentColumnMutation } from '~/queries/cards'
import { useUpdateColumnMutation } from '~/queries/columns'
import { BoardResType } from '~/schemas/board.schema'
import { CardType } from '~/schemas/card.schema'
import { ColumnType } from '~/schemas/column.schema'
import { UserType } from '~/schemas/user.schema'
import {
  clearActiveBoard,
  getBoardDetails,
  updateActiveBoard,
  updateCardInBoard,
  setBoardDrawerOpen
} from '~/store/slices/board.slice'
import { updateActiveCard } from '~/store/slices/card.slice'
import { setWorkspaceDrawerOpen } from '~/store/slices/workspace.slice'

export default function BoardDetails() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const isScreenBelowMedium = useMediaQuery(theme.breakpoints.down('md'))

  const { workspaceDrawerOpen } = useAppSelector((state) => state.workspace)
  const { boardDrawerOpen } = useAppSelector((state) => state.board)

  const { boardId } = useParams()
  const queryConfig = useQueryConfig()

  const dispatch = useAppDispatch()
  const { activeBoard, loading, error } = useAppSelector((state) => state.board)
  const { socket } = useAppSelector((state) => state.app)

  const handleWorkspaceDrawerOpen = (open: boolean) => {
    dispatch(setWorkspaceDrawerOpen(open))
  }

  const handleBoardDrawerOpen = (open: boolean) => {
    dispatch(setBoardDrawerOpen(open))
  }

  const [updateBoardMutation] = useUpdateBoardMutation()
  const [updateColumnMutation] = useUpdateColumnMutation()
  const [moveCardToDifferentColumnMutation] = useMoveCardToDifferentColumnMutation()

  const {
    isAdmin,
    isMember,
    isClosed,
    canManageBoard,
    canEditBoardInfo,
    canChangeBoardBackground,
    canCreateColumn,
    canEditColumn,
    canCreateCard,
    canEditCard,
    canDeleteBoard,
    canManageMembers,
    canDragAndDrop
  } = useBoardPermission(activeBoard)

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

  // Rejoin the board room on socket reconnect
  useEffect(() => {
    if (!socket || !boardId) return

    const onReconnect = () => {
      socket.emit('CLIENT_JOIN_BOARD', boardId)

      const workspaceId = activeBoard?.workspace_id

      if (workspaceId) {
        socket.emit('CLIENT_JOIN_WORKSPACE', workspaceId)
      }
    }

    socket.on('reconnect', onReconnect)

    return () => {
      socket.off('reconnect', onReconnect)
    }
  }, [socket, boardId, activeBoard?.workspace_id])

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

    const onUserAcceptedBoardInvitation = (invitee: UserType) => {
      const newMember = cloneDeep(invitee)
      const newActiveBoard = cloneDeep(activeBoard)

      const workspaceId = newActiveBoard?.workspace_id as string

      newActiveBoard?.members?.push({
        ...newMember,
        role: BoardRole.Member,
        joined_at: new Date(),
        user_id: newMember._id
      })

      dispatch(updateActiveBoard(newActiveBoard))

      dispatch(
        boardApi.util.prefetch(
          'getJoinedWorkspaceBoards',
          { workspace_id: workspaceId, ...queryConfig },
          { force: true }
        )
      )
    }

    const onUserDeletedBoard = () => {
      dispatch(clearActiveBoard())
    }

    socket?.on('SERVER_BOARD_UPDATED', onUpdateBoard)
    socket?.on('SERVER_CARD_UPDATED', onUpdateCard)
    socket?.on('SERVER_USER_ACCEPTED_BOARD_INVITATION', onUserAcceptedBoardInvitation)
    socket?.on('SERVER_USER_DELETED_BOARD', onUserDeletedBoard)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('SERVER_BOARD_UPDATED', onUpdateBoard)
      socket?.off('SERVER_CARD_UPDATED', onUpdateCard)
      socket?.off('SERVER_USER_ACCEPTED_BOARD_INVITATION', onUserAcceptedBoardInvitation)
      socket?.off('SERVER_USER_DELETED_BOARD', onUserDeletedBoard)
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
    }
  }, [dispatch, socket, activeBoard, queryConfig])

  // Join the workspace room when the activeBoard is available, listen for workspace updates
  useEffect(() => {
    if (!socket || !activeBoard) return

    const workspaceId = activeBoard.workspace_id

    if (!workspaceId) return

    // Join the workspace room to receive workspace-level updates impacting this board
    socket.emit('CLIENT_JOIN_WORKSPACE', workspaceId)

    const onUpdateWorkspace = (_workspaceId: string, updatedBoardId?: string) => {
      // If the update targets this board, refetch its details and the joined workspace boards for consistency
      if (updatedBoardId === activeBoard._id) {
        dispatch(getBoardDetails(activeBoard._id))
        dispatch(
          boardApi.util.prefetch(
            'getJoinedWorkspaceBoards',
            { workspace_id: workspaceId, ...queryConfig },
            { force: true }
          )
        )
      }
    }

    socket.on('SERVER_WORKSPACE_UPDATED', onUpdateWorkspace)

    return () => {
      socket.emit('CLIENT_LEAVE_WORKSPACE', workspaceId)
      socket.off('SERVER_WORKSPACE_UPDATED', onUpdateWorkspace)
    }
  }, [socket, activeBoard, dispatch, queryConfig])

  const onMoveColumns = (dndOrderedColumns: ColumnType[]) => {
    if (isClosed) return

    // Get the IDs of the columns in the order they are being moved
    const dndOrderedCardsIds = dndOrderedColumns.map((column) => column._id)

    updateBoardMutation({
      id: activeBoard?._id as string,
      body: { column_order_ids: dndOrderedCardsIds }
    }).then((res) => {
      if (!res.error) {
        const newActiveBoard = { ...activeBoard! }
        newActiveBoard.columns = dndOrderedColumns
        newActiveBoard.column_order_ids = dndOrderedCardsIds

        dispatch(updateActiveBoard(newActiveBoard))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
      }
    })
  }

  const onMoveCardInTheSameColumn = (dndOrderedCards: CardType[], dndOrderedCardsIds: string[], columnId: string) => {
    if (isClosed) return

    updateColumnMutation({
      id: columnId,
      body: { card_order_ids: dndOrderedCardsIds }
    }).then((res) => {
      if (!res.error) {
        const newActiveBoard = cloneDeep(activeBoard)
        const columnToUpdate = newActiveBoard?.columns?.find((column) => column._id === columnId)

        if (columnToUpdate) {
          columnToUpdate.cards = dndOrderedCards
          columnToUpdate.card_order_ids = dndOrderedCardsIds
        }

        dispatch(updateActiveBoard(newActiveBoard))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
      }
    })
  }

  const onMoveCardToDifferentColumn = (
    currentCardId: string,
    prevColumnId: string,
    nextColumnId: string,
    dndOrderedColumns: ColumnType[]
  ) => {
    if (isClosed) return

    /**
     * When moving a card to another Column:
     * Step 1: Update the `card_order_ids` array of the original Column containing it (essentially, remove the Card's _id from the array)
     * Step 2: Update the `card_order_ids` array of the target Column (essentially, add the Card's _id to the array)
     * Step 3: Update the new columnId field of the dragged Card
     * => Implement a dedicated support API.
     */

    // Get the IDs of the columns in the order they are being moved
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)

    let prevCardOrderIds = dndOrderedColumns.find((column) => column._id === prevColumnId)?.card_order_ids as string[]
    let nextCardOrderIds = dndOrderedColumns.find((column) => column._id === nextColumnId)?.card_order_ids as string[]

    // Handle the issue when dragging the last Card out of a Column;
    // If the Column is empty, there will be a placeholder card that needs to be removed before sending data to the backend server.
    if (prevCardOrderIds[0]?.includes('placeholder-card')) {
      prevCardOrderIds = []
    }

    moveCardToDifferentColumnMutation({
      current_card_id: currentCardId,
      prev_column_id: prevColumnId,
      prev_card_order_ids: prevCardOrderIds,
      next_column_id: nextColumnId,
      next_card_order_ids: nextCardOrderIds
    }).then((res) => {
      if (!res.error) {
        const newActiveBoard = { ...activeBoard! }

        newActiveBoard.columns = dndOrderedColumns
        newActiveBoard.column_order_ids = dndOrderedColumnsIds

        dispatch(updateActiveBoard(newActiveBoard))

        socket?.emit('CLIENT_USER_UPDATED_BOARD', newActiveBoard)
      }
    })
  }

  if (loading === 'pending') {
    return <PageLoadingSpinner caption='Loading board...' />
  }

  if (error || !activeBoard) {
    if (error?.includes('403')) {
      return <BoardErrorView title='Access Denied' description='You do not have permission to access this board.' />
    }

    return <BoardErrorView />
  }

  const getBoardBackgroundImage = (board: BoardResType['result']) => {
    if (board.cover_photo && board.cover_photo.trim() !== '') {
      return `url(${board.cover_photo})`
    }

    if (board.background_color && board.background_color.startsWith('linear-gradient')) {
      return board.background_color
    }

    return 'none'
  }

  const getBoardBgcolor = (board: BoardResType['result'], isDarkMode: boolean) => {
    if (!board.cover_photo && board.background_color && !board.background_color.startsWith('linear-gradient')) {
      return board.background_color
    }

    return isDarkMode ? 'grey.900' : 'primary.main'
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <Helmet>
        <title>{activeBoard.title} | Trellone</title>
        <meta
          name='description'
          content="Organize anything, together. Trellone is a collaboration tool that organizes your projects into boards. In one glance, know what's being worked on, who's working on what, and where something is in a process"
        />
      </Helmet>

      <NavBar />

      <ActiveCard canEditCard={canEditCard} />

      <Box
        sx={{
          position: 'relative',
          backgroundImage: getBoardBackgroundImage(activeBoard),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          bgcolor: getBoardBgcolor(activeBoard, isDarkMode)
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

        {isClosed && <BoardClosedBanner />}

        <Box sx={{ display: 'flex' }}>
          {activeBoard.workspace_id && (
            <WorkspaceDrawer
              open={workspaceDrawerOpen}
              onOpen={handleWorkspaceDrawerOpen}
              boardId={boardId}
              workspace={activeBoard.workspace}
              isBoardClosed={isClosed}
            />
          )}

          <BoardBar
            workspaceDrawerOpen={workspaceDrawerOpen}
            onWorkspaceDrawerOpen={handleWorkspaceDrawerOpen}
            boardDrawerOpen={boardDrawerOpen}
            onBoardDrawerOpen={handleBoardDrawerOpen}
            board={activeBoard}
            isBoardMember={isMember}
            canEditBoardInfo={canEditBoardInfo}
            canManageMembers={canManageMembers}
            hasWorkspace={!!activeBoard.workspace_id}
          />

          <Main
            workspaceDrawerOpen={activeBoard.workspace_id ? workspaceDrawerOpen : false}
            boardDrawerOpen={boardDrawerOpen}
            sx={{
              overflowX: 'auto',
              overflowY: 'hidden',
              width: '100%',
              minWidth: 0,
              minHeight: 0,
              display: 'block',
              height: (theme) =>
                isClosed ? `calc(${theme.trellone.boardMainHeight} - 48px)` : theme.trellone.boardMainHeight
            }}
          >
            <DrawerHeader />

            {isScreenBelowMedium && <DrawerHeader />}

            <BoardContent
              board={activeBoard}
              onMoveColumns={onMoveColumns}
              onMoveCardInTheSameColumn={onMoveCardInTheSameColumn}
              onMoveCardToDifferentColumn={onMoveCardToDifferentColumn}
              canDragAndDrop={canDragAndDrop}
              canCreateColumn={canCreateColumn}
              canEditColumn={canEditColumn}
              canCreateCard={canCreateCard}
            />
          </Main>

          <BoardDrawer
            open={boardDrawerOpen}
            onOpen={handleBoardDrawerOpen}
            boardMembers={activeBoard.members}
            boardId={boardId!}
            isBoardAdmin={isAdmin}
            canManageBoard={canManageBoard}
            canEditBoardInfo={canEditBoardInfo}
            canChangeBoardBackground={canChangeBoardBackground}
            canDeleteBoard={canDeleteBoard}
          />
        </Box>
      </Box>
    </Container>
  )
}
