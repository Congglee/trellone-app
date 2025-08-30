import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { boardApi } from '~/queries/boards'
import { BoardResType } from '~/schemas/board.schema'
import {
  CreateWorkspaceBodyType,
  EditWorkspaceMemberRoleBodyType,
  RemoveGuestFromBoardBodyType,
  RemoveWorkspaceMemberFromBoardBodyType,
  UpdateWorkspaceBodyType,
  WorkspaceListResType,
  WorkspaceResType
} from '~/schemas/workspace.schema'
import { CommonQueryParams } from '~/types/query-params.type'

const WORKSPACE_API_URL = '/workspaces' as const

const reducerPath = 'workspace/api' as const
const tagTypes = ['Workspace'] as const

export const workspaceApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    addWorkspace: build.mutation<WorkspaceResType, CreateWorkspaceBodyType>({
      query: (body) => ({ url: WORKSPACE_API_URL, method: 'POST', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error creating the workspace')
          console.error(error)
        }
      },
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }]
    }),

    getWorkspaces: build.query<WorkspaceListResType, CommonQueryParams>({
      query: (params) => ({ url: WORKSPACE_API_URL, method: 'GET', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.workspaces.map(({ _id }) => ({ type: 'Workspace' as const, id: _id })),
              { type: 'Workspace' as const, id: 'LIST' }
            ]
          : [{ type: 'Workspace' as const, id: 'LIST' }]
    }),

    getWorkspace: build.query<WorkspaceResType, string>({
      query: (id) => ({ url: `${WORKSPACE_API_URL}/${id}`, method: 'GET' }),
      providesTags: (result) => (result ? [{ type: 'Workspace', id: result.result._id }] : tagTypes)
    }),

    updateWorkspace: build.mutation<WorkspaceResType, { id: string; body: UpdateWorkspaceBodyType }>({
      query: ({ id, body }) => ({ url: `${WORKSPACE_API_URL}/${id}`, method: 'PUT', data: body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Workspace', id },
        { type: 'Workspace', id: 'LIST' }
      ]
    }),

    editWorkspaceMemberRole: build.mutation<
      WorkspaceResType,
      { workspace_id: string; user_id: string; body: EditWorkspaceMemberRoleBodyType }
    >({
      query: ({ workspace_id, user_id, body }) => ({
        url: `${WORKSPACE_API_URL}/${workspace_id}/members/${user_id}/role`,
        method: 'PUT',
        data: body
      }),
      invalidatesTags: (_result, _error, { workspace_id }) => [{ type: 'Workspace', id: workspace_id }]
    }),

    leaveWorkspace: build.mutation<WorkspaceResType, string>({
      query: (id) => ({
        url: `${WORKSPACE_API_URL}/${id}/members/me/leave`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Workspace', id }]
    }),

    removeWorkspaceMember: build.mutation<WorkspaceResType, { workspace_id: string; user_id: string }>({
      query: ({ workspace_id, user_id }) => ({
        url: `${WORKSPACE_API_URL}/${workspace_id}/members/${user_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, { workspace_id }) => [{ type: 'Workspace', id: workspace_id }]
    }),

    removeWorkspaceMemberFromBoard: build.mutation<
      WorkspaceResType,
      {
        workspace_id: string
        user_id: string
        body: RemoveWorkspaceMemberFromBoardBodyType
      }
    >({
      query: ({ workspace_id, user_id, body }) => ({
        url: `${WORKSPACE_API_URL}/${workspace_id}/members/${user_id}/boards`,
        method: 'DELETE',
        data: body
      }),
      invalidatesTags: (_result, _error, { workspace_id }) => [{ type: 'Workspace', id: workspace_id }]
    }),

    addGuestToWorkspace: build.mutation<WorkspaceResType, { workspace_id: string; user_id: string }>({
      query: ({ workspace_id, user_id }) => ({
        url: `${WORKSPACE_API_URL}/${workspace_id}/guests/${user_id}/add-to-workspace`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, { workspace_id }) => [{ type: 'Workspace', id: workspace_id }]
    }),

    removeGuestFromWorkspace: build.mutation<WorkspaceResType, { workspace_id: string; user_id: string }>({
      query: ({ workspace_id, user_id }) => ({
        url: `${WORKSPACE_API_URL}/${workspace_id}/guests/${user_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, { workspace_id }) => [{ type: 'Workspace', id: workspace_id }]
    }),

    removeGuestFromBoard: build.mutation<
      WorkspaceResType,
      { workspace_id: string; user_id: string; body: RemoveGuestFromBoardBodyType }
    >({
      query: ({ workspace_id, user_id, body }) => ({
        url: `${WORKSPACE_API_URL}/${workspace_id}/guests/${user_id}/boards`,
        method: 'DELETE',
        data: body
      }),
      invalidatesTags: (_result, _error, { workspace_id }) => [{ type: 'Workspace', id: workspace_id }]
    }),

    joinWorkspaceBoard: build.mutation<BoardResType, { workspace_id: string; board_id: string }>({
      query: ({ workspace_id, board_id }) => ({
        url: `${WORKSPACE_API_URL}/${workspace_id}/join/${board_id}`,
        method: 'POST'
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(boardApi.util.invalidateTags([{ type: 'Board', id: 'LIST' }]))
        } catch (error) {
          console.error(error)
        }
      },
      invalidatesTags: (_result, _error, { workspace_id }) => [{ type: 'Workspace', id: workspace_id }]
    })
  })
})

export const {
  useAddWorkspaceMutation,
  useGetWorkspacesQuery,
  useGetWorkspaceQuery,
  useUpdateWorkspaceMutation,
  useEditWorkspaceMemberRoleMutation,
  useLeaveWorkspaceMutation,
  useRemoveWorkspaceMemberMutation,
  useRemoveWorkspaceMemberFromBoardMutation,
  useAddGuestToWorkspaceMutation,
  useRemoveGuestFromWorkspaceMutation,
  useRemoveGuestFromBoardMutation,
  useJoinWorkspaceBoardMutation
} = workspaceApi

const workspaceApiReducer = workspaceApi.reducer

export default workspaceApiReducer
