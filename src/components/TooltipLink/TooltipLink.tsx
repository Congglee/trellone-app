import Tooltip from '@mui/material/Tooltip'
import { ReactNode } from 'react'

interface TooltipLinkProps {
  href?: string
  children?: ReactNode
  [key: string]: any
}

export default function TooltipLink({ href, children, ...props }: TooltipLinkProps) {
  if (!href) {
    return <a {...props}>{children}</a>
  }

  return (
    <Tooltip title={href} placement='bottom' arrow>
      <a href={href} {...props}>
        {children}
      </a>
    </Tooltip>
  )
}
