import { useMemo } from 'react'
import { WORKSPACE_ROLES } from '~/constants/roles'
import { WorkspaceRole } from '~/constants/type'
import { useAppSelector } from '~/lib/redux/hooks'
import { WorkspaceSchema } from '~/schemas/workspace.schema'
import { z } from 'zod'

type WorkspaceItem = z.infer<typeof WorkspaceSchema>

/**
 * Custom hook for managing granular member access control within a workspace context.
 *
 * This hook efficiently determines user permissions based on their assigned roles and
 * workspace membership, supports dynamic permission checks, and is easily extensible
 * for future role or permission updates. It also identifies guest users for proper
 * access control and redirection logic.
 *
 * @param workspace - The workspace object to check permissions against (can be null/undefined during loading)
 * @returns An object containing permission utilities and user status information
 *
 * @example
 * ```typescript
 * const { hasPermission, isWorkspaceAdmin, isMember, isGuest } = useWorkspacePermission(workspace)
 *
 * // Check specific permissions
 * if (hasPermission('board:create')) {
 *   // Render create board button
 * }
 *
 * // Check admin status
 * if (isWorkspaceAdmin) {
 *   // Render admin-only features
 * }
 *
 * // Check membership status
 * if (!isMember) {
 *   // Show access denied message
 * }
 *
 * // Check guest status for redirection
 * if (isGuest) {
 *   // Redirect to boards list
 * }
 * ```
 */
export const useWorkspacePermission = (workspace: WorkspaceItem | null | undefined) => {
  const { profile } = useAppSelector((state) => state.auth)

  const permissionData = useMemo(() => {
    if (!workspace || !profile) {
      return {
        permissions: new Set<string>(),
        isWorkspaceAdmin: false,
        userRole: null,
        isMember: false,
        isGuest: false
      }
    }

    // Find the current user in the workspace members list
    const member = workspace.members.find((m) => m.user_id === profile._id)

    // Check if the current user is in the guests array
    // Guests can be either User objects with _id property or string IDs
    const isGuest = workspace.guests.some((guest) => {
      if (typeof guest === 'string') {
        return guest === profile._id
      }
      return guest._id === profile._id
    })

    // If user is not a member of the workspace
    if (!member) {
      return {
        permissions: new Set<string>(),
        isWorkspaceAdmin: false,
        userRole: null,
        isMember: false,
        isGuest
      }
    }

    // Find the role details from the WORKSPACE_ROLES constant
    const roleDetails = WORKSPACE_ROLES.find((r) => r.name === member.role)

    // Create a Set for efficient permission lookups
    const permissionSet = new Set(roleDetails?.permissions || [])

    return {
      permissions: permissionSet,
      isWorkspaceAdmin: member.role === WorkspaceRole.Admin,
      userRole: member.role,
      isMember: true,
      isGuest: false // Members cannot be guests
    }
  }, [workspace, profile])

  /**
   * Check if the current user has a specific permission
   * @param permission - The permission string to check (e.g., 'board:create', 'workspace:update')
   * @returns true if the user has the permission, false otherwise
   */
  const hasPermission = useMemo(() => {
    return (permission: string) => {
      return permissionData.permissions.has(permission)
    }
  }, [permissionData.permissions])

  return {
    permissions: permissionData.permissions,
    isWorkspaceAdmin: permissionData.isWorkspaceAdmin,
    hasPermission,
    userRole: permissionData.userRole,
    isMember: permissionData.isMember,
    isGuest: permissionData.isGuest
  }
}
