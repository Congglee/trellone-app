import { styled } from '@mui/material/styles'
import { forwardRef } from 'react'

const HiddenInputStyles = styled('input')({
  display: 'none'
  /*
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  */
})

const VisuallyHiddenInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return <HiddenInputStyles ref={ref} {...props} />
})

export default VisuallyHiddenInput
