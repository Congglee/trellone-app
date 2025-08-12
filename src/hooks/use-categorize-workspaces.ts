import { useMemo } from 'react'
import { useAppSelector } from '~/lib/redux/hooks'
import { WorkspaceResType } from '~/schemas/workspace.schema'

/**
 * Custom hook for categorizing workspaces based on user membership
 *
 * @param workspaces Array of workspaces to categorize
 * @returns Object containing memberWorkspaces and guestWorkspaces arrays
 *
 * @example
 * ```typescript
 * const { memberWorkspaces, guestWorkspaces } = useCategorizeWorkspaces(workspaces)
 * ```
 */
export const useCategorizeWorkspaces = (workspaces: WorkspaceResType['result'][]) => {
  const { profile } = useAppSelector((state) => state.auth)

  const categorizedWorkspaces = useMemo(() => {
    if (!profile?._id || !workspaces) {
      return { memberWorkspaces: [], guestWorkspaces: [] }
    }

    const memberWorkspaces: WorkspaceResType['result'][] = []
    const guestWorkspaces: WorkspaceResType['result'][] = []

    workspaces.forEach((workspace) => {
      // Check if user is in members array
      const isMember = workspace.members.some((member) => member.user_id === profile._id)

      if (isMember) {
        memberWorkspaces.push(workspace)
      } else {
        // Check if user is in guests array
        const isGuest = workspace.guests.some((id) => id === profile._id)

        if (isGuest) {
          guestWorkspaces.push(workspace)
        }
      }
    })

    return { memberWorkspaces, guestWorkspaces }
  }, [workspaces, profile?._id])

  return categorizedWorkspaces
}
