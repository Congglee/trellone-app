import {
  Active,
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
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MouseSensor, TouchSensor } from '~/lib/sensors'
import Card from '~/pages/Boards/BoardDetails/components/Card'
import Column from '~/pages/Boards/BoardDetails/components/Column'
import ColumnsList from '~/pages/Boards/BoardDetails/components/ColumnsList'
import { BoardResType } from '~/schemas/board.schema'
import { CardType } from '~/schemas/card.schema'
import { ColumnType } from '~/schemas/column.schema'
import { generatePlaceholderCard } from '~/utils/utils'

interface BoardContentProps {
  board: BoardResType['result']
  onMoveColumns: (dndOrderedColumns: ColumnType[]) => void
  onMoveCardInTheSameColumn: (dndOrderedCards: CardType[], dndOrderedCardsIds: string[], columnId: string) => void
  onMoveCardToDifferentColumn: (
    currentCardId: string,
    prevColumnId: string,
    nextColumnId: string,
    dndOrderedColumns: ColumnType[]
  ) => void
  isBoardMember: boolean
}

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

export default function BoardContent({
  board,
  onMoveColumns,
  onMoveCardInTheSameColumn,
  onMoveCardToDifferentColumn,
  isBoardMember
}: BoardContentProps) {
  // `activationConstraint` is the condition to trigger the event
  // Require the mouse to move 10px before the event is triggered, to fix the issue where a click unintentionally triggers the drag-and-drop event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })

  // Press and hold for 250ms and the touch tolerance (500px) must be met before the event is triggered
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })

  // Prioritize combining both mouse and touch sensors to ensure the best experience on mobile devices and avoid bugs
  const sensors = useSensors(mouseSensor, touchSensor)

  const [sortedColumns, setSortedColumns] = useState<ColumnType[]>([])

  // Only one item (column or card) can be dragged at a time
  const [activeDragItemId, setActiveDragItemId] = useState<UniqueIdentifier | null>(null)
  const [activeDragItemType, setActiveDragItemType] = useState<string | null>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<any | null>(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState<ColumnType | null>(null)

  // The previous last collision point (used for collision detection algorithm processing)
  const lastOverId = useRef<UniqueIdentifier | null>(null)

  useEffect(() => {
    setSortedColumns(board.columns!)
  }, [board])

  const findColumnByCardId = (cardId: UniqueIdentifier) => {
    // Note this section: you should use `column.cards` instead of `column.card_order_ids` because in the `handleDragOver` step, we first complete the `cards` data before generating the new `card_order_ids`.
    return sortedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId as string))
  }

  const moveCardBetweenDifferentColumns = ({
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  }: {
    overColumn: ColumnType
    overCardId: UniqueIdentifier
    active: Active
    over: Over
    activeColumn: ColumnType
    activeDraggingCardId: UniqueIdentifier
    activeDraggingCardData: any
    triggerFrom?: 'handleDragEnd' | 'handleDragOver'
  }) => {
    setSortedColumns((prevColumns) => {
      // Find the position (index) of the `overCard` in the target column (where the `activeCard` is about to be dropped)
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId) as number

      // Logic to calculate the "new cardIndex" (above or below the overCard), standardized from the dnd-kit library code
      let newCardIndex: number
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : (overColumn?.cards?.length as number) + 1

      // Clone the old `sortedColumns` state array to a new one for data processing, then return and update the new `sortedColumns` state
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)

      // nextActiveColumn: previous Column
      if (nextActiveColumn) {
        // Remove the card from the active column (which can also be understood as the previous column, where the card was dragged out to move to another column)
        nextActiveColumn.cards = nextActiveColumn.cards?.filter((card) => card._id !== activeDraggingCardId)

        // Add a Placeholder Card if the Column is empty: when all Cards have been dragged out and none remain
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Update the `card_order_ids` array to standardize the data
        nextActiveColumn.card_order_ids = nextActiveColumn.cards?.map((card) => card._id) as string[]
      }

      // nextOverColumn: New column
      if (nextOverColumn) {
        // Check if the dragged card already exists in overColumn; if it does, it needs to be removed first
        nextOverColumn.cards = nextOverColumn.cards?.filter((card) => card._id !== activeDraggingCardId)

        // The `column_id` in the card must be updated to standardize the data after dragging the card between two different columns
        const rebuildActiveDraggingCardData = {
          ...activeDraggingCardData,
          column_id: nextOverColumn._id
        }

        // Next, add the dragged card to overColumn at the new index position
        nextOverColumn.cards = nextOverColumn.cards?.toSpliced(newCardIndex, 0, rebuildActiveDraggingCardData)

        // Remove the Placeholder Card if it exists
        nextOverColumn.cards = nextOverColumn.cards?.filter((card) => !card.FE_PlaceholderCard)

        // Update the `card_order_ids` array to standardize the data
        nextOverColumn.card_order_ids = nextOverColumn.cards?.map((card) => card._id) as string[]
      }

      // If this function is called from handleDragEnd, it means the drag-and-drop has finished; at this point, call the API once here.
      if (triggerFrom === 'handleDragEnd') {
        // You must use activeDragItemData.columnId or, preferably, oldColumnWhenDraggingCard._id (set in state from the handleDragStart step), not activeData in the handleDragEnd scope, because after passing through onDragOver and reaching this point, the card's state has already been updated once.
        onMoveCardToDifferentColumn(
          activeDraggingCardId as string,
          oldColumnWhenDraggingCard?._id as string,
          nextOverColumn?._id as string,
          nextColumns
        )
      }

      return nextColumns
    })
  }

  // Trigger when starting to drag an element
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItemId(event?.active?.id as string)
    setActiveDragItemType(
      event?.active?.data?.current?.column_id ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    // Only perform actions to set the oldColumn value if dragging a card
    if (event?.active?.data?.current?.column_id) {
      const column = findColumnByCardId(event?.active?.id)!
      setOldColumnWhenDraggingCard(column)
    }
  }

  // Trigger while dragging an element
  const handleDragOver = (event: DragOverEvent) => {
    // Do nothing further if dragging a Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return
    }

    // For Card
    // If dragging a card, handle additional logic to allow moving the card between columns
    const { active, over } = event

    // Check if active or over does not exist (when dragging out of the container's scope), do nothing (to prevent page crash)
    if (!active || !over) {
      return
    }

    // activeDraggingCard: The card currently being dragged
    const {
      id: activeDraggingCardId, // The ID of the card currently being dragged
      data: { current: activeDraggingCardData } // The data of the card currently being dragged
    } = active

    // overCard: the card that is being interacted with above or below the dragged card
    // Id of the column that the card is being dragged over
    const { id: overCardId } = over

    // Find the two columns by cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // If either of the two columns does not exist, do nothing to prevent the webpage from crashing
    if (!activeColumn || !overColumn) {
      return
    }

    // Only handle the logic here when dragging a card between two different columns; if dragging the card within its original column, do nothing
    // Because this is the logic for handling during drag (handleDragOver), while handling after the drag is completed is a different matter (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns({
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        triggerFrom: 'handleDragOver'
      })
    }
  }

  // Trigger when finishing the drag action of an element => drop action
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    // Check if active or over does not exist (when dragging out of the container's scope), do nothing (to prevent page crash)
    if (!active || !over) {
      return
    }

    // Handle card drag-and-drop
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: The card currently being dragged
      const {
        id: activeDraggingCardId, // The ID of the card currently being dragged
        data: { current: activeDraggingCardData } // The data of the card currently being dragged
      } = active

      // overCard: the card that is being interacted with above or below the dragged card
      // Id of the column that the card is being dragged over
      const { id: overCardId } = over

      // Find the two columns by cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // If either of the two columns does not exist, do nothing to prevent the webpage from crashing
      if (!activeColumn || !overColumn) {
        return
      }

      if (oldColumnWhenDraggingCard?._id !== overColumn._id) {
        // Drag-and-drop action for a card between two different columns
        // You must use activeDragItemData.columnId or oldColumnWhenDraggingCard (set in state from the handleDragStart step), not activeData in the handleDragEnd scope, because after passing through onDragOver and reaching this point, the card's state has already been updated once.
        moveCardBetweenDifferentColumns({
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          triggerFrom: 'handleDragEnd'
        })
      } else {
        // Drag-and-drop action for a card within the same column

        // Get the old position (from oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (card) => card._id === activeDragItemId
        ) as number

        // Get the new position (from overColumn)
        const newCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId) as number

        const oldColumnCards = oldColumnWhenDraggingCard?.cards as CardType[]

        // Use `arrayMove` because dragging a card within the same column is similar to the logic of dragging a column within a board content
        const dndOrderedCards = arrayMove(oldColumnCards, oldCardIndex, newCardIndex)
        const dndOrderedCardsIds = dndOrderedCards.map((card) => card._id)

        // Still update the state here to avoid delay or interface flickering during drag-and-drop while waiting for the API call (small trick to avoid flickering)
        setSortedColumns((prevColumns) => {
          // Clone the old `sortedColumns` state array to a new one for data processing, then return and update the new `sortedColumns` state
          const nextColumns = cloneDeep(prevColumns)

          // Find the Column where we are dropping.
          const targetColumn = nextColumns.find((column) => column._id === overColumn._id)!

          // Update the two new values, `cards` and `card_order_ids`, in targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.card_order_ids = dndOrderedCardsIds

          // Return the new state value (with correct positions)
          return nextColumns
        })

        onMoveCardInTheSameColumn(dndOrderedCards, dndOrderedCardsIds, (oldColumnWhenDraggingCard as ColumnType)._id)
      }
    }

    // Handle column drag-and-drop within a `BoardContent`
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // If the position after drag-and-drop is different from the original position
        const oldColumnIndex = sortedColumns.findIndex((column) => column._id === active.id)

        // Get the new position (from over column)
        const newColumnIndex = sortedColumns.findIndex((column) => column._id === over.id)

        // Use `arrayMove` from dnd-kit to reorder the original columns array
        const dndOrderedColumns = arrayMove(sortedColumns, oldColumnIndex, newColumnIndex)

        // Still update the state here to avoid delay or interface flickering during drag-and-drop while waiting for the API call (small trick)
        setSortedColumns(dndOrderedColumns)

        onMoveColumns(dndOrderedColumns)
      }
    }

    // The data after drag-and-drop must always be reset to the default null value
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  /**
   * Animation when dropping an element - Test by dragging and then dropping directly and observing the Overlay placeholder
   */
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } }
    })
  }

  // We will customize the strategy/algorithm for collision detection optimized for dragging cards between multiple columns
  const collisionDetectionStrategy = useCallback(
    (args: any) => {
      // In the case of dragging a column, the `closestCorners` algorithm is the most accurate to use
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      // Find intersection points, collisions, and return an array of collisions (intersections) with the pointer
      const pointerIntersections = pointerWithin(args)

      // If pointerIntersections is an empty array, return immediately and do nothing
      // Completely fix the flickering bug of the dnd-kit library in the following case:
      //  - Dragging a card with a large image cover and dragging it to the top, out of the drag-and-drop area
      if (!pointerIntersections?.length) {
        return []
      }

      // Find the first overId in the pointerIntersections array above
      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        // This is the key part to fix the flickering issue.
        // If the over element is a column, find the nearest cardId inside the collision area using either the `closestCenter` or `closestCorners` collision detection algorithm.
        // However, in this case, using `closestCorners` provides a smoother experience.
        const checkColumn = sortedColumns.find((column) => column._id === overId)

        if (checkColumn) {
          // Can use `closestCenter` or `closestCorners` here
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container: DroppableContainer) => {
              return container.id !== overId && checkColumn?.card_order_ids?.includes(container.id as string)
            })
          })[0]?.id
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      // If overId is null, return an empty array to prevent page crash bugs
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
          display: 'flex',
          width: '100%',
          p: 1.25,

          // Fix the bug that cannot drag empty column to a column with 2 or more cards
          // But this makes half of the screen unable to scroll horizontally on below desktop devices
          height: 'calc(100% - 254px)'
        }}
        {...(!isBoardMember && { 'data-no-dnd': 'true' })}
      >
        <ColumnsList columns={sortedColumns} isBoardMember={isBoardMember} />

        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}

          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}

          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}
