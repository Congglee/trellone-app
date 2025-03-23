import Alert from '@mui/material/Alert'

interface FieldErrorAlertProps {
  errorMessage?: string
}

export default function FieldErrorAlert({ errorMessage }: FieldErrorAlertProps) {
  if (!errorMessage) return null

  return (
    <Alert severity='error' sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
      {errorMessage}
    </Alert>
  )
}
