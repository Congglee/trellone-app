# System Patterns

## Application Architecture

### High-Level Structure

```
Frontend (React/TypeScript) ←→ Backend API ←→ Database
       ↕                            ↕
   Socket.io Client ←→ Socket.io Server
       ↕                            ↕
   Real-time UI Updates ←→ Real-time Broadcasts
```

### Application Routing Structure

```
App (Route Guards & Socket Management)
├── ProtectedRoute (Authenticated Users)
│   ├── HomeLayout (/home)
│   │   ├── Home (Dashboard)
│   │   └── BoardsList (/boards)
│   ├── BoardDetails (/boards/:boardId) - Standalone
│   └── Settings (/settings/account, /settings/security)
├── RejectedRoute (Unauthenticated Users)
│   ├── AuthLayout
│   │   ├── Login (/login)
│   │   ├── Register (/register)
│   │   ├── ForgotPassword (/forgot-password)
│   │   └── ResetPassword (/reset-password)
│   ├── AccountVerification (/account/verification)
│   ├── ForgotPasswordVerification (/forgot-password/verification)
│   └── BoardInvitationVerification (/board-invitation/verification)
├── OAuth (/login/oauth) - Special handling
└── NotFound (404) - Catch all
```

### Component Hierarchy (Board Details)

```
BoardDetails (Main Board View)
├── BoardBar (Top Navigation & Controls)
├── WorkspaceDrawer (Left Sidebar - Board List)
├── BoardContent (Main Kanban Area)
│   ├── ColumnsList (Drag & Drop Context)
│   │   ├── Column Components
│   │   └── CardsList (Sortable Cards)
│   │       └── Card Components
│   └── DnD Overlay (Visual Feedback)
├── BoardDrawer (Right Sidebar - Settings)
└── ActiveCard Modal (Card Details)
    ├── Card Attachments
    ├── Card Description (Markdown Editor)
    ├── Card Members
    ├── Card Due Dates
    └── Card Activity Feed
```

## State Management Architecture

### Redux Store Structure

```
store/
├── auth: { isAuthenticated, profile }
├── app: { socket, theme, loading }
├── board: { activeBoard, loading, error }
├── card: { activeCard, isShowModal }
└── notification: { notifications, hasNew }
```

### RTK Query API Slices

```
queries/
├── auth.ts: Authentication & user management
├── boards.ts: Board CRUD operations
├── columns.ts: Column management
├── cards.ts: Card operations & updates
├── users.ts: User profile & settings
├── medias.ts: File upload & management
└── invitations.ts: Board invitation system
```

### Data Flow Pattern

1. **Component Triggers Action** → `useAppDispatch(action)`
2. **RTK Query Mutation** → `useMutationHook().unwrap()`
3. **Optimistic Update** → `dispatch(updateLocalState)`
4. **API Call** → `axios POST/PUT/DELETE`
5. **Socket Broadcast** → `socket.emit('CLIENT_EVENT', data)`
6. **Real-time Sync** → `socket.on('SERVER_EVENT', callback)`

## Real-time Collaboration Patterns

### Socket.io Event Architecture

```
Client Events (Outbound):
├── CLIENT_JOIN_BOARD: Join board room
├── CLIENT_LEAVE_BOARD: Leave board room
├── CLIENT_USER_UPDATED_BOARD: Board changes
├── CLIENT_USER_UPDATED_CARD: Card changes
└── CLIENT_USER_INVITED_TO_BOARD: Send invitations

Server Events (Inbound):
├── SERVER_BOARD_UPDATED: Receive board updates
├── SERVER_CARD_UPDATED: Receive card updates
├── SERVER_USER_INVITED_TO_BOARD: Receive invitations
├── connect: Connection established
└── disconnect: Connection lost
```

### Collaboration State Sync Pattern

```typescript
// 1. Optimistic Update (Immediate UI)
dispatch(updateActiveBoard(newBoard))

// 2. Persist to Server
updateBoardMutation({ id, body })

// 3. Broadcast to Others
socket?.emit('CLIENT_USER_UPDATED_BOARD', newBoard)

// 4. Receive Updates from Others
useEffect(() => {
  const onUpdateBoard = (board) => {
    dispatch(updateActiveBoard(board))
  }
  socket?.on('SERVER_BOARD_UPDATED', onUpdateBoard)
  return () => socket?.off('SERVER_BOARD_UPDATED', onUpdateBoard)
}, [socket])
```

## Component Design Patterns

### Component Organization

```
Component/
├── Component.tsx          # Main implementation
├── index.ts              # Export barrel
└── subcomponents/        # Sub-components (if needed)
    ├── SubComponent/
    │   ├── SubComponent.tsx
    │   └── index.ts
    └── ...
```

### Props Interface Pattern

```typescript
interface ComponentProps {
  // Required props first
  id: string
  title: string
  onUpdate: (data: UpdateType) => void

  // Optional props with defaults
  loading?: boolean
  variant?: 'primary' | 'secondary'

  // Callback props for parent communication
  onClose?: () => void
  onError?: (error: string) => void
}
```

### Hook Usage Patterns

```typescript
export default function Component({ id, onUpdate }: ComponentProps) {
  // 1. App-level hooks first
  const dispatch = useAppDispatch()
  const { data, loading } = useAppSelector(state => state.entity)

  // 2. RTK Query hooks
  const [updateMutation] = useUpdateMutation()
  const { data: queryData } = useGetDataQuery(id)

  // 3. React hooks
  const [localState, setLocalState] = useState('')
  const ref = useRef<HTMLElement>(null)

  // 4. Custom hooks
  const debouncedValue = useDebounce(localState, 500)

  // 5. Event handlers
  const handleUpdate = async () => {
    // Implementation
  }

  // 6. Effects last
  useEffect(() => {
    // Side effects
  }, [dependencies])

  return <JSX />
}
```

## Drag & Drop Architecture

### DnD Kit Implementation

```
DndContext (Board Level)
├── sensors: [Mouse, Touch, Keyboard]
├── collision detection: closestCorners
├── onDragStart/Over/End handlers
└── DragOverlay for visual feedback

SortableContext (Column Level)
├── items: column._id arrays
├── strategy: verticalListSortingStrategy
└── SortableContext (Card Level)
    ├── items: card._id arrays
    ├── strategy: verticalListSortingStrategy
    └── useSortable hooks in components
```

### Drag & Drop State Management

```typescript
// Column Reordering
const onMoveColumns = (dndOrderedColumns) => {
  // 1. Update UI immediately
  dispatch(updateActiveBoard({ ...board, columns: dndOrderedColumns }))

  // 2. Persist column order
  updateBoardMutation({ column_order_ids: newOrder })

  // 3. Broadcast change
  socket?.emit('CLIENT_USER_UPDATED_BOARD', newBoard)
}

// Card Movement (Same Column)
const onMoveCardInTheSameColumn = (cards, cardIds, columnId) => {
  // Update specific column's card order
  const updatedBoard = cloneDeep(activeBoard)
  const column = updatedBoard.columns.find((col) => col._id === columnId)
  column.cards = cards
  column.card_order_ids = cardIds

  dispatch(updateActiveBoard(updatedBoard))
  updateColumnMutation({ id: columnId, body: { card_order_ids: cardIds } })
  socket?.emit('CLIENT_USER_UPDATED_BOARD', updatedBoard)
}
```

## Form Management Patterns

### React Hook Form + Zod Integration

```typescript
// Schema Definition
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
})

type FormData = z.infer<typeof schema>

// Form Implementation
const {
  register,
  handleSubmit,
  formState: { errors },
  reset
} = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { title: '', description: '' }
})

const onSubmit = handleSubmit(async (data) => {
  try {
    await createMutation(data).unwrap()
    reset()
    toast.success('Created successfully!')
  } catch (error) {
    toast.error('Creation failed!')
  }
})
```

### MUI Integration Pattern

```typescript
// Controller for MUI Components
<Controller
  name="title"
  control={control}
  render={({ field, fieldState: { error } }) => (
    <TextField
      {...field}
      label="Title"
      error={!!error}
      helperText={error?.message}
      fullWidth
    />
  )}
/>
```

## Error Handling Patterns

### API Error Handling

```typescript
// RTK Query Error Handling
const [updateMutation] = useUpdateMutation()

const handleUpdate = async (data) => {
  try {
    const result = await updateMutation(data).unwrap()
    toast.success('Updated successfully!')
    return result
  } catch (error) {
    if (isUnprocessableEntityError(error)) {
      // Handle validation errors
      const validationErrors = error.data.errors
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, { message })
      })
    } else {
      // Handle general errors
      toast.error('Update failed!')
    }
    throw error
  }
}
```

### Type Guard Patterns

```typescript
// Error Type Guards
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isUnprocessableEntityError<T>(error: unknown): error is EntityError<T> {
  return isFetchBaseQueryError(error) && error.status === 422 && typeof error.data === 'object'
}
```

## Styling Architecture

### Theme Integration

```typescript
// Theme Extension
declare module '@mui/material/styles' {
  interface Theme {
    trellone: {
      navBarHeight: string
      workspaceDrawerWidth: string
      boardBarHeight: string
      // ... custom theme properties
    }
  }
}

// Theme Usage
sx={{
  minHeight: (theme) => theme.trellone.boardBarHeight,
  backgroundColor: (theme) =>
    theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
}}
```

### Styled Components Pattern

```typescript
const StyledComponent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,

  // Theme-aware styling
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],

  // Responsive styling
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  },

  // Hover states
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))
```

## Performance Patterns

### Memoization Strategy

```typescript
// Component Memoization
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  return <ComplexRender data={data} onUpdate={onUpdate} />
})

// Value Memoization
const filteredCards = useMemo(() => {
  return cards.filter(card => !card._destroy)
}, [cards])

// Callback Memoization
const handleUpdate = useCallback((id: string, updates: UpdateType) => {
  updateMutation({ id, body: updates })
}, [updateMutation])
```

### Code Splitting Pattern

```typescript
// Route-based Lazy Loading
const BoardDetails = lazy(() => import('~/pages/Boards/BoardDetails'))
const Settings = lazy(() => import('~/pages/Settings'))

// Suspense Integration
<Route
  path="/boards/:boardId"
  element={
    <Suspense fallback={<PageLoadingSpinner />}>
      <BoardDetails />
    </Suspense>
  }
/>
```

## Security Patterns

### Authentication Flow

```typescript
// Protected Route Pattern
const ProtectedRoute = ({ profile, isAuthenticated }) => {
  return profile && isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />
}

// Token Management
useEffect(() => {
  const token = getAccessTokenFromLS()
  if (isAuthenticated && profile) {
    dispatch(setSocket(generateSocketInstance(token)))
  }
}, [isAuthenticated, profile])
```

### Input Sanitization

```typescript
// Markdown Sanitization
<MDEditor.Markdown
  source={description}
  rehypePlugins={[rehypeSanitize]}
/>

// File Upload Validation
const validateFile = (file: File) => {
  if (file.size > config.maxSizeUploadAvatar) {
    return 'File too large'
  }
  if (!config.allowedImageMimeTypes.includes(file.type)) {
    return 'Invalid file type'
  }
  return null
}
```

This system architecture ensures scalable, maintainable, and performant React application with real-time collaboration capabilities.
