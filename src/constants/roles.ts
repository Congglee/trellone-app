import { RoleLevel, WorkspaceRole } from '~/constants/type'

export const PERMISSIONS = {
  VIEW_WORKSPACE: 'workspace:read',
  UPDATE_WORKSPACE: 'workspace:update',
  DELETE_WORKSPACE: 'workspace:delete',
  MANAGE_WORKSPACE_SETTINGS: 'workspace:manage_settings',
  MANAGE_WORKSPACE_MEMBERS: 'workspace:manage_members',
  MANAGE_WORKSPACE_ROLES: 'workspace:manage_roles',
  VIEW_WORKSPACE_MEMBERS: 'workspace:view_members',
  MANAGE_WORKSPACE_GUESTS: 'workspace:manage_guests',
  VIEW_WORKSPACE_ANALYTICS: 'workspace:view_analytics',
  EXPORT_WORKSPACE_DATA: 'workspace:export_data',
  MANAGE_WORKSPACE_INTEGRATIONS: 'workspace:manage_integrations',

  CREATE_BOARD: 'board:create',
  VIEW_BOARD: 'board:read',
  UPDATE_BOARD: 'board:update',
  VIEW_ALL_BOARDS: 'board:read_all',
  UPDATE_ALL_BOARDS: 'board:update_all',
  DELETE_ALL_BOARDS: 'board:delete_all',
  MANAGE_BOARD_MEMBERS_ALL: 'board:manage_members_all',
  VIEW_ASSIGNED_BOARDS: 'board:read_assigned',
  UPDATE_ASSIGNED_BOARDS: 'board:update_assigned',
  MANAGE_OWN_MEMBERSHIP: 'board:manage_own_membership',

  CREATE_INVITATION: 'invitation:create',
  MANAGE_INVITATION: 'invitation:manage',
  VIEW_ALL_INVITATIONS: 'invitation:view_all',
  VIEW_OWN_INVITATIONS: 'invitation:view_own',
  RESPOND_TO_INVITATION: 'invitation:respond',

  CREATE_COLUMN: 'column:create',
  UPDATE_COLUMN: 'column:update',

  CREATE_CARD: 'card:create',
  UPDATE_CARD: 'card:update',
  COMMENT_ON_CARD: 'card:comment',
  ATTACH_FILES_TO_CARD: 'card:attach_files'
}

const WORKSPACE_ADMIN_PERMISSIONS = [
  // === Workspace Management ===
  'workspace:read', // View workspace details
  'workspace:update', // Edit workspace (title, description, type, logo)
  'workspace:delete', // Delete entire workspace
  'workspace:manage_settings', // Change workspace type (Public/Private)

  // === Member Management ===
  'workspace:manage_members', // Add/remove workspace members
  'workspace:manage_roles', // Change member roles
  'workspace:view_members', // View all workspace members
  'workspace:manage_guests', // Add/remove guest users

  // === Board Operations (Workspace-Scoped) ===
  'board:create', // Create new boards in workspace
  'board:read', // View boards (scope determined by middleware)
  'board:update', // Edit boards (scope determined by middleware)
  'board:read_all', // View all workspace boards
  'board:update_all', // Edit any board in workspace
  'board:delete_all', // Delete any board in workspace
  'board:manage_members_all', // Manage members on any board

  // === Invitation Management ===
  'invitation:create', // Send board invitations
  'invitation:manage', // Accept/reject/cancel invitations
  'invitation:view_all', // View all workspace invitations

  // === Advanced Operations ===
  'workspace:view_analytics', // Access workspace analytics/stats
  'workspace:export_data', // Export workspace data
  'workspace:manage_integrations' // Manage external integrations
]

const WORKSPACE_NORMAL_PERMISSIONS = [
  // === Basic Workspace Access ===
  'workspace:read', // View workspace details
  'workspace:view_members', // View workspace members (read-only)

  // === Board Operations (Limited) ===
  'board:create', // Create new boards in workspace
  'board:read', // View boards (scope determined by middleware)
  'board:update', // Edit boards (scope determined by middleware)
  'board:read_assigned', // View boards they're members of
  'board:update_assigned', // Edit boards they're members of
  'board:manage_own_membership', // Leave boards they're on

  // === Collaboration Features ===
  'invitation:create', // Send board invitations (limited scope)
  'invitation:view_own', // View their own invitations
  'invitation:respond', // Accept/reject invitations sent to them

  // === Content Management ===
  'column:create', // Create columns in accessible boards
  'column:update', // Edit columns in accessible boards
  'card:create', // Create cards
  'card:update', // Edit cards
  'card:comment', // Comment on cards
  'card:attach_files' // Add attachments to cards
]

export const WORKSPACE_ROLES = [
  {
    name: WorkspaceRole.Admin,
    level: RoleLevel.Workspace,
    permissions: WORKSPACE_ADMIN_PERMISSIONS
  },
  {
    name: WorkspaceRole.Normal,
    level: RoleLevel.Workspace,
    permissions: WORKSPACE_NORMAL_PERMISSIONS
  }
]
