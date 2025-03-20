import {
  Active,
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DroppableContainer,
  getFirstCollision,
  Over,
  pointerWithin,
  UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import { cloneDeep, isEmpty } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MouseSensor, TouchSensor } from '~/lib/dnd-kit'
import Card from '~/pages/Boards/BoardDetails/components/Card'
import Column from '~/pages/Boards/BoardDetails/components/Column'
import ColumnsList from '~/pages/Boards/BoardDetails/components/ColumnsList'
import { useUpdateBoardMutation } from '~/queries/boards'
import { useUpdateColumnMutation } from '~/queries/columns'
import { BoardResType } from '~/schemas/board.schema'
import { CardType } from '~/schemas/card.schema'
import { ColumnType } from '~/schemas/column.schema'
import { generatePlaceholderCard } from '~/utils/utils'

interface BoardContentProps {
  board: BoardResType['result']
}

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

export default function BoardContent({ board }: BoardContentProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [sortedColumns, setSortedColumns] = useState<ColumnType[]>([])
  const [activeDragItemId, setActiveDragItemId] = useState<UniqueIdentifier | null>(null)
  const [activeDragItemType, setActiveDragItemType] = useState<string | null>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<any | null>(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState<ColumnType | null>(null)

  const lastOverId = useRef<UniqueIdentifier | null>(null)

  const [updateBoardMutation] = useUpdateBoardMutation()
  const [updateColumnMutation] = useUpdateColumnMutation()

  useEffect(() => {
    setSortedColumns(board.columns!)
  }, [board])

  const findColumnByCardId = (cardId: UniqueIdentifier) => {
    return sortedColumns.find((column) => column?.cards?.map((card) => card._id).includes(cardId as string))
  }

  const moveColumns = async (dndOrderedColumns: ColumnType[]) => {
    const boardColumnOrderIds = dndOrderedColumns.map((column) => column._id)

    await updateBoardMutation({
      id: board._id,
      body: {
        column_order_ids: boardColumnOrderIds,
        dnd_ordered_columns: dndOrderedColumns
      }
    })
  }

  const moveCardInTheSameColumn = async (
    dndOrderedCards: CardType[],
    dndOrderedCardsIds: string[],
    columnId: string
  ) => {
    await updateColumnMutation({
      id: columnId,
      body: {
        card_order_ids: dndOrderedCardsIds,
        board_id: board._id,
        dnd_ordered_cards: dndOrderedCards
      }
    })
  }

  const moveCardBetweenDifferentColumns = ({
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  }: {
    overColumn: ColumnType
    overCardId: UniqueIdentifier
    active: Active
    over: Over
    activeColumn: ColumnType
    activeDraggingCardId: UniqueIdentifier
    activeDraggingCardData: CardType
  }) => {
    setSortedColumns((prevColumns) => {
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId) ?? -1

      let newCardIndex: number
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : (overColumn?.cards?.length ?? 0) + 1

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards?.filter((card) => card._id !== activeDraggingCardId)

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        nextActiveColumn.card_order_ids = nextActiveColumn.cards?.map((card) => card._id) as string[]
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards?.filter((card) => card._id !== activeDraggingCardId)

        const rebuildActiveDraggingCardData = {
          ...activeDraggingCardData,
          column_id: nextOverColumn._id
        }

        nextOverColumn.cards = nextOverColumn.cards?.toSpliced(newCardIndex, 0, rebuildActiveDraggingCardData)

        nextOverColumn.cards = nextOverColumn.cards?.filter((card) => !card.FE_PlaceholderCard)

        nextOverColumn.card_order_ids = nextOverColumn.cards?.map((card) => card._id) as string[]
      }

      return nextColumns
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    setActiveDragItemId(active?.id as string)
    setActiveDragItemType(active?.data?.current?.column_id ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(active?.data?.current)

    if (active?.data?.current?.column_id) {
      const column = findColumnByCardId(active?.id) as ColumnType
      setOldColumnWhenDraggingCard(column)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return
    }

    const { active, over } = event

    if (!active || !over) {
      return
    }

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) {
      return
    }

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns({
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData: activeDraggingCardData as CardType
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!active || !over) {
      return
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) {
        return
      }

      if (oldColumnWhenDraggingCard && oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns({
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData: activeDraggingCardData as CardType
        })
      } else {
        const oldCardIndex =
          oldColumnWhenDraggingCard?.cards?.findIndex((card) => card._id === activeDraggingCardId) ?? -1
        const newCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId) ?? -1
        const oldColumnCards = oldColumnWhenDraggingCard?.cards ?? []

        const dndOrderedCards = arrayMove(oldColumnCards, oldCardIndex, newCardIndex)
        const dndOrderedCardsIds = dndOrderedCards.map((card) => card._id)

        setSortedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)

          const targetColumn = nextColumns.find((column) => column._id === overColumn._id) as ColumnType

          targetColumn.cards = dndOrderedCards
          targetColumn.card_order_ids = dndOrderedCardsIds

          return nextColumns
        })

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardsIds, (oldColumnWhenDraggingCard as ColumnType)._id)
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = sortedColumns.findIndex((column) => column._id === active.id)
        const newColumnIndex = sortedColumns.findIndex((column) => column._id === over.id)

        const dndOrderedColumns = arrayMove(sortedColumns, oldColumnIndex, newColumnIndex)

        setSortedColumns(dndOrderedColumns)

        moveColumns(dndOrderedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } }
    })
  }

  const collisionDetectionStrategy = useCallback(
    (args: any) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      const pointerIntersections = pointerWithin(args)

      if (!pointerIntersections?.length) {
        return []
      }

      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        const checkColumn = sortedColumns.find((column) => column._id === overId)

        if (checkColumn) {
          // Can use `closestCenter` or `closestCorners` here
          overId = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter((container: DroppableContainer) => {
              return container.id !== overId && checkColumn?.card_order_ids?.includes(container.id as string)
            })
          })[0]?.id
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, sortedColumns]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
        <ColumnsList boardId={board._id} columns={sortedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}
