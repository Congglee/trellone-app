import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { WorkspaceRoleValues } from '~/constants/type'
import Box from '@mui/material/Box'
import { WorkspaceMemberRoleType } from '~/schemas/workspace.schema'
import { useEditWorkspaceMemberRoleMutation } from '~/queries/workspaces'
import { toast } from 'react-toastify'

interface RoleSelectProps {
  currentRole: WorkspaceMemberRoleType
  disabled?: boolean
  userId: string
  workspaceId: string
}

export default function RoleSelect({ currentRole, disabled = false, userId, workspaceId }: RoleSelectProps) {
  const [anchorRoleMenuElement, setAnchorRoleMenuElement] = useState<null | HTMLElement>(null)
  const isRoleMenuOpen = Boolean(anchorRoleMenuElement)

  const handleRoleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setAnchorRoleMenuElement(event.currentTarget)
    }
  }

  const handleRoleMenuClose = () => {
    setAnchorRoleMenuElement(null)
  }

  const [editWorkspaceMemberRoleMutation, { isError }] = useEditWorkspaceMemberRoleMutation()

  const handleRoleSelect = async (role: WorkspaceMemberRoleType) => {
    if (role !== currentRole) {
      await editWorkspaceMemberRoleMutation({
        workspace_id: workspaceId,
        user_id: userId,
        body: { role }
      })
    }

    handleRoleMenuClose()
  }

  useEffect(() => {
    if (isError) {
      toast.error('Not enough admins')
    }
  }, [isError])

  return (
    <Box>
      <Button
        id='role-select-button'
        aria-controls={isRoleMenuOpen ? 'role-select-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={isRoleMenuOpen ? 'true' : undefined}
        onClick={handleRoleMenuClick}
        size='small'
        variant='outlined'
        disabled={disabled}
        endIcon={!disabled ? <KeyboardArrowDownIcon /> : undefined}
        sx={{ borderRadius: 1, textTransform: 'none', minWidth: 120 }}
      >
        {currentRole}
      </Button>
      <Menu
        id='role-select-menu'
        anchorEl={anchorRoleMenuElement}
        open={isRoleMenuOpen}
        onClose={handleRoleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'role-select-button'
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {WorkspaceRoleValues.map((role) => (
          <MenuItem
            key={role}
            onClick={() => handleRoleSelect(role)}
            selected={role === currentRole}
            sx={{ minWidth: 120 }}
          >
            {role}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
