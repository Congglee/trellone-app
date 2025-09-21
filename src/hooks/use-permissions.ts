import { useMemo } from 'react'
import { useAppSelector } from '~/lib/redux/hooks'
import {
  WorkspacePermission,
  WORKSPACE_ROLE_PERMISSIONS,
  BoardPermission,
  BOARD_ROLE_PERMISSIONS
} from '~/constants/permissions'
import { WorkspaceRole, BoardRole } from '~/constants/type'
import { WorkspaceResType, WorkspaceMemberRoleType } from '~/schemas/workspace.schema'
import { UserType } from '~/schemas/user.schema'
import { BoardResType, BoardMemberRoleType } from '~/schemas/board.schema'

type WorkspaceItem = WorkspaceResType['result'] | BoardResType['result']['workspace'] | null | undefined

interface UseWorkspacePermissionReturn {
  role: WorkspaceMemberRoleType | null
  isMember: boolean
  isGuest: boolean
  isAdmin: boolean
  isNormal: boolean
  permissions: WorkspacePermission[]
  hasPermission: (permission: WorkspacePermission) => boolean
  canViewWorkspace: boolean
  canCreateBoard: boolean
  canManageWorkspace: boolean
  canManageMembers: boolean
  canManageGuests: boolean
  canDeleteWorkspace: boolean
}

/**
 * Hook to determine the current user's role and permissions within a workspace.
 *
 * - Computes membership (member/guest) and role-specific permissions for members
 * - Guests are treated as non-members and have no member permissions
 *
 * @param workspace The workspace data to check against
 * @param userIdOverride Optional user id to check permissions for (defaults to authenticated user)
 */
export const useWorkspacePermission = (
  workspace?: WorkspaceItem,
  userIdOverride?: string
): UseWorkspacePermissionReturn => {
  const { profile } = useAppSelector((state) => state.auth)

  const userId = userIdOverride ?? profile?._id ?? null

  const { role, isMember, isGuest } = useMemo(() => {
    if (!workspace || !userId) {
      return {
        role: null as WorkspaceMemberRoleType | null,
        isMember: false,
        isGuest: false
      }
    }

    const members = workspace.members ?? []
    const member = members.find((m) => m.user_id === userId)
    const isMember = Boolean(member)

    // Detect guest in both shapes: array of strings or array of user objects
    const guests = (workspace.guests ?? []) as (string | UserType)[]
    const isGuest = !isMember ? guests.some((g) => (typeof g === 'string' ? g === userId : g._id === userId)) : false

    return { role: member?.role ?? null, isMember, isGuest }
  }, [workspace, userId])

  const permissions = useMemo<WorkspacePermission[]>(() => {
    if (!role) return []
    return WORKSPACE_ROLE_PERMISSIONS[role]
  }, [role])

  const hasPermission = (permission: WorkspacePermission) => permissions.includes(permission)

  const isAdmin = role === WorkspaceRole.Admin
  const isNormal = role === WorkspaceRole.Normal

  return {
    role,
    isMember,
    isGuest,
    isAdmin,
    isNormal,
    permissions,
    hasPermission,
    canViewWorkspace: hasPermission(WorkspacePermission.ViewWorkspace),
    canCreateBoard: hasPermission(WorkspacePermission.CreateBoard),
    canManageWorkspace: hasPermission(WorkspacePermission.ManageWorkspace),
    canManageMembers: hasPermission(WorkspacePermission.ManageMembers),
    canManageGuests: hasPermission(WorkspacePermission.ManageGuests),
    canDeleteWorkspace: hasPermission(WorkspacePermission.DeleteWorkspace)
  }
}

type BoardItem = BoardResType['result'] | null | undefined

interface UseBoardPermissionReturn {
  role: BoardMemberRoleType | null
  isMember: boolean
  isGuest: boolean
  isClosed: boolean
  isAdmin: boolean
  isNormal: boolean
  isObserver: boolean
  permissions: BoardPermission[]
  hasPermission: (permission: BoardPermission) => boolean
  canViewBoard: boolean
  canManageBoard: boolean
  canManageMembers: boolean
  canCreateColumn: boolean
  canEditColumn: boolean
  canDeleteColumn: boolean
  canCreateCard: boolean
  canEditCard: boolean
  canDeleteCard: boolean
  canComment: boolean
  canAttach: boolean
  canDeleteBoard: boolean
}

/**
 * Hook to determine the current user's role and permissions within a board.
 *
 * - Computes membership (member/guest) and role-specific permissions for members
 * - Guests are treated as non-members and have no member permissions
 *
 * @param board The board data to check against
 * @param userIdOverride Optional user id to check permissions for (defaults to authenticated user)
 */
export const useBoardPermission = (board?: BoardItem, userIdOverride?: string): UseBoardPermissionReturn => {
  const { profile } = useAppSelector((state) => state.auth)

  const userId = userIdOverride ?? profile?._id ?? null

  const { role, isMember, isGuest } = useMemo(() => {
    if (!board || !userId) {
      return {
        role: null as BoardMemberRoleType | null,
        isMember: false,
        isGuest: false
      }
    }

    const members = board.members ?? []
    const member = members.find((m) => m.user_id === userId)
    const isMember = Boolean(member)

    // Detect guest using workspace guests on the board object
    const guests = (board.workspace?.guests ?? []) as (string | UserType)[]
    const isGuest = !isMember ? guests.some((g) => (typeof g === 'string' ? g === userId : g._id === userId)) : false

    return { role: member?.role ?? null, isMember, isGuest }
  }, [board, userId])

  const permissions = useMemo<BoardPermission[]>(() => {
    if (!role) return []
    return BOARD_ROLE_PERMISSIONS[role]
  }, [role])

  const hasPermission = (permission: BoardPermission) => permissions.includes(permission)

  const isAdmin = role === BoardRole.Admin
  const isNormal = role === BoardRole.Member
  const isObserver = role === BoardRole.Observer

  const isClosed = Boolean(board?._destroy)

  return {
    role,
    isMember,
    isGuest,
    isClosed,
    isAdmin,
    isNormal,
    isObserver,
    permissions,
    hasPermission,
    // View remains allowed according to role even when closed; all interactions below are disabled if closed
    canViewBoard: hasPermission(BoardPermission.ViewBoard),
    canManageBoard: hasPermission(BoardPermission.ManageBoard) && !isClosed,
    canManageMembers: hasPermission(BoardPermission.ManageMembers) && !isClosed,
    canCreateColumn: hasPermission(BoardPermission.CreateColumn) && !isClosed,
    canEditColumn: hasPermission(BoardPermission.EditColumn) && !isClosed,
    canDeleteColumn: hasPermission(BoardPermission.DeleteColumn) && !isClosed,
    canCreateCard: hasPermission(BoardPermission.CreateCard) && !isClosed,
    canEditCard: hasPermission(BoardPermission.EditCard) && !isClosed,
    canDeleteCard: hasPermission(BoardPermission.DeleteCard) && !isClosed,
    canComment: hasPermission(BoardPermission.Comment) && !isClosed,
    canAttach: hasPermission(BoardPermission.Attach) && !isClosed,
    canDeleteBoard: hasPermission(BoardPermission.DeleteBoard) && isClosed
  }
}
