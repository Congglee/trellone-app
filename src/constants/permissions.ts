import { BoardRole, WorkspaceRole } from '~/constants/type'
import { BoardMemberRoleType } from '~/schemas/board.schema'
import { WorkspaceMemberRoleType } from '~/schemas/workspace.schema'

export enum WorkspacePermission {
  ViewWorkspace = 'WORKSPACE__VIEW',
  CreateBoard = 'WORKSPACE__CREATE_BOARD',
  ManageWorkspace = 'WORKSPACE__MANAGE',
  ManageMembers = 'WORKSPACE__MANAGE_MEMBERS',
  ManageGuests = 'WORKSPACE__MANAGE_GUESTS',
  DeleteWorkspace = 'WORKSPACE__DELETE',
  JoinWorkspaceBoard = 'WORKSPACE__JOIN_BOARD'
}

export enum BoardPermission {
  ViewBoard = 'BOARD__VIEW',
  ManageBoard = 'BOARD__MANAGE',
  ManageMembers = 'BOARD__MANAGE_MEMBERS',
  CreateColumn = 'BOARD__CREATE_COLUMN',
  EditColumn = 'BOARD__EDIT_COLUMN',
  DeleteColumn = 'BOARD__DELETE_COLUMN',
  CreateCard = 'BOARD__CREATE_CARD',
  EditCard = 'BOARD__EDIT_CARD',
  DeleteCard = 'BOARD__DELETE_CARD',
  Comment = 'BOARD__COMMENT',
  Attach = 'BOARD__ATTACH',
  DeleteBoard = 'BOARD__DELETE'
}

export const WORKSPACE_ROLE_PERMISSIONS: Record<WorkspaceMemberRoleType, WorkspacePermission[]> = {
  [WorkspaceRole.Admin]: [
    WorkspacePermission.ViewWorkspace,
    WorkspacePermission.CreateBoard,
    WorkspacePermission.ManageWorkspace,
    WorkspacePermission.ManageMembers,
    WorkspacePermission.ManageGuests,
    WorkspacePermission.DeleteWorkspace,
    WorkspacePermission.JoinWorkspaceBoard
  ],
  [WorkspaceRole.Normal]: [
    WorkspacePermission.ViewWorkspace,
    WorkspacePermission.CreateBoard,
    WorkspacePermission.JoinWorkspaceBoard
  ]
}

export const BOARD_ROLE_PERMISSIONS: Record<BoardMemberRoleType, BoardPermission[]> = {
  [BoardRole.Admin]: [
    BoardPermission.ViewBoard,
    BoardPermission.ManageBoard,
    BoardPermission.ManageMembers,
    BoardPermission.CreateColumn,
    BoardPermission.EditColumn,
    BoardPermission.DeleteColumn,
    BoardPermission.CreateCard,
    BoardPermission.EditCard,
    BoardPermission.DeleteCard,
    BoardPermission.Comment,
    BoardPermission.Attach,
    BoardPermission.DeleteBoard
  ],
  [BoardRole.Member]: [
    BoardPermission.ViewBoard,
    BoardPermission.ManageBoard,
    BoardPermission.CreateColumn,
    BoardPermission.EditColumn,
    BoardPermission.CreateCard,
    BoardPermission.EditCard,
    BoardPermission.Comment,
    BoardPermission.Attach
  ],
  [BoardRole.Observer]: [BoardPermission.ViewBoard]
}
