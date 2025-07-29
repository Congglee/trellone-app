import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { CreateWorkspaceBodyType, WorkspaceListResType, WorkspaceResType } from '~/schemas/workspace.schema'
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
    })
  })
})

export const { useAddWorkspaceMutation, useGetWorkspacesQuery, useGetWorkspaceQuery } = workspaceApi

const workspaceApiReducer = workspaceApi.reducer

export default workspaceApiReducer
