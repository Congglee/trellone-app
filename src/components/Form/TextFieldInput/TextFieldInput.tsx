import { FieldPath, FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form'
import TextField, { TextFieldProps } from '@mui/material/TextField'

interface TextFieldInputProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  register?: UseFormRegister<TFieldValues>
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
  name?: FieldPath<TFieldValues>
}

export default function TextFieldInput<TFieldValues extends FieldValues = FieldValues>({
  register,
  rules,
  name,
  ...rest
}: TextFieldInputProps<TFieldValues>) {
  const registerResult = register && name ? register(name, rules) : null

  return <TextField fullWidth variant='outlined' {...registerResult} {...rest} />
}
