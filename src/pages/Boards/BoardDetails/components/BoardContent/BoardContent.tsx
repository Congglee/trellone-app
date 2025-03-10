import {
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import Card from '~/pages/Boards/BoardDetails/components/Card'
import Column from '~/pages/Boards/BoardDetails/components/Column'
import ColumnsList from '~/pages/Boards/BoardDetails/components/ColumnsList'
import { Board } from '~/types/board.type'
import { Column as ColumnType } from '~/types/column.type'
import { mapOrder } from '~/utils/sorts'
import { Card as CardType } from '~/types/card.type'

interface BoardContentProps {
  board: Board
}

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

export default function BoardContent({ board }: BoardContentProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
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

  useEffect(() => {
    setSortedColumns(mapOrder(board.columns, board.column_order_ids, '_id'))
  }, [board])

  const findColumnByCardId = (cardId: UniqueIdentifier) => {
    return sortedColumns.find((column) => column?.cards?.map((card) => card._id).includes(cardId as string))
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

          nextActiveColumn.card_order_ids = nextActiveColumn.cards?.map((card) => card._id) as string[]
        }

        if (nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards?.filter((card) => card._id !== activeDraggingCardId)

          nextOverColumn.cards = nextOverColumn.cards?.toSpliced(newCardIndex, 0, activeDraggingCardData as CardType)

          nextOverColumn.card_order_ids = nextOverColumn.cards?.map((card) => card._id) as string[]
        }

        return nextColumns
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
        //
      } else {
        const oldCardIndex =
          oldColumnWhenDraggingCard?.cards?.findIndex((card) => card._id === activeDraggingCardId) ?? -1
        const newCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId) ?? -1
        const oldColumnCards = oldColumnWhenDraggingCard?.cards ?? []

        const dndSortedCards = arrayMove(oldColumnCards, oldCardIndex, newCardIndex)

        setSortedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)

          const targetColumn = nextColumns.find((column) => column._id === overColumn._id) as ColumnType

          targetColumn.cards = dndSortedCards
          targetColumn.card_order_ids = dndSortedCards.map((card) => card._id)

          return nextColumns
        })
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = sortedColumns.findIndex((column) => column._id === active.id)
        const newColumnIndex = sortedColumns.findIndex((column) => column._id === over.id)

        const dndOrderedColumns = arrayMove(sortedColumns, oldColumnIndex, newColumnIndex)

        setSortedColumns(dndOrderedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: '0.5' }
      }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
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
        <ColumnsList columns={sortedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}
