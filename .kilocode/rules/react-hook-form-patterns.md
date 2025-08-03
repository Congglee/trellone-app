# React Hook Form Patterns

## Brief overview

This rule defines the standardized patterns and best practices for implementing React Hook Form within the Trellone project. These guidelines ensure consistent form handling, validation, error management, and TypeScript integration across all components.

## Form setup and configuration

- Always use `zodResolver` with Zod schemas for form validation to ensure type safety and consistent validation logic
- Import resolver from `@hookform/resolvers/zod` and schemas from the appropriate schema files in `~/schemas/`
- Always provide `defaultValues` in the form configuration object, even for empty forms
- Use TypeScript generics with schema-derived types for complete type safety: `useForm<CreateBoardBodyType>`

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  setError,
  reset
} = useForm<CreateBoardBodyType>({
  resolver: zodResolver(CreateBoardBody),
  defaultValues: { title: '', description: '', type: BoardType.Public }
})
```

## Form state destructuring patterns

- Always destructure `register`, `handleSubmit`, and `formState: { errors }` as minimum requirements
- Include `setError` when handling server-side validation errors
- Include `reset` when form values need to be updated based on props or external data
- Include `control` only when using `Controller` for complex form controls
- Use consistent destructuring order: `register`, `control`, `setError`, `handleSubmit`, `reset`, `formState`

## Input component integration

- Use the custom `TextFieldInput` component with the `register` prop for all text inputs
- Pass error state using double negation pattern: `error={!!errors['field_name']}`
- Always follow input with `FieldErrorAlert` component for consistent error display
- Use bracket notation for error field access to maintain consistency: `errors['field_name']`

```typescript
<TextFieldInput
  name='title'
  register={register}
  label='Board Title'
  error={!!errors['title']}
/>
<FieldErrorAlert errorMessage={errors.title?.message} />
```

## Controller usage for complex controls

- Use `Controller` component for Material-UI components that don't work directly with `register`
- Apply to Select, RadioGroup, DatePicker, and other controlled components
- Always destructure field props and handle onChange events explicitly
- Maintain consistent field value handling with fallbacks

```typescript
<Controller
  name='workspace_id'
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      value={field.value || ''}
      onChange={(event) => field.onChange(event.target.value)}
    >
      {/* options */}
    </Select>
  )}
/>
```

## Form submission patterns

- Always wrap submission logic with `handleSubmit` from React Hook Form
- Use async functions for form submission to handle API calls properly
- Handle successful submissions with navigation or state updates
- Use `.then()` pattern for RTK Query mutations to check for errors

```typescript
const onSubmit = handleSubmit(async (values) => {
  addBoardMutation(values).then((res) => {
    if (!res.error) {
      navigate(`/boards/${res.data?.result._id}`)
    }
  })
})
```

## Server-side error handling

- Always implement `useEffect` hook to handle server validation errors
- Use `isUnprocessableEntityError` type guard to check error types
- Iterate through error object and set individual field errors using `setError`
- Follow consistent error mapping pattern with proper TypeScript typing

```typescript
useEffect(() => {
  if (isError && isUnprocessableEntityError<CreateBoardBodyType>(error)) {
    const formError = error.data.errors

    if (formError) {
      for (const [key, value] of Object.entries(formError)) {
        setError(key as keyof CreateBoardBodyType, {
          type: value.type,
          message: value.msg
        })
      }
    }
  }
}, [isError, error, setError])
```

## Form reset and data synchronization

- Use `reset` function to update form values when external data changes
- Implement `useEffect` hooks to sync form state with props or API data
- Always check for data existence before calling reset
- Use dependency arrays that include the data source and reset function

```typescript
useEffect(() => {
  if (workspace && open) {
    const { title, description } = workspace
    reset({ title, description })
  }
}, [workspace, reset, open])
```

## TypeScript integration

- Always use schema-derived types for form data: `CreateBoardBodyType`, `UpdateWorkspaceBodyType`
- Import types from schema files to maintain single source of truth
- Use proper generic typing for `useForm`, `handleSubmit`, and error handling functions
- Maintain type safety in error handling with `keyof` operator for field names

## Form validation and error display

- Rely on Zod schemas for all validation logic rather than inline validation
- Use `FieldErrorAlert` component consistently for all error displays
- Position error alerts immediately after their corresponding input fields
- Use optional chaining for error message access: `errors.field?.message`

## Loading states and user feedback

- Add `className='interceptor-loading'` to submit buttons for consistent loading indicators
- Use RTK Query loading states from mutation hooks when needed
- Implement proper disabled states during form submission
- Provide immediate user feedback for successful operations

## Form accessibility and UX

- Always provide proper labels for form inputs through the `label` prop
- Use appropriate input types (email, password, text) for semantic correctness
- Implement proper form structure with semantic HTML elements
- Ensure proper focus management and keyboard navigation

## File upload handling

- Use `VisuallyHiddenInput` component for file input styling consistency
- Implement proper file validation before submission
- Handle file uploads separately from form data when needed
- Use FormData for multipart form submissions with file attachments

## Popover and modal form patterns

- Reset form state when popover/modal opens using `useEffect` with open state dependency
- Close popover/modal after successful form submission
- Handle form cleanup on component unmount or close events
- Maintain consistent popover positioning and styling patterns
