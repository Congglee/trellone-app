import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { workspaceApi } from '~/queries/workspaces'
import { BoardListResType, BoardResType, CreateBoardBodyType, UpdateBoardBodyType } from '~/schemas/board.schema'
import { BoardQueryParams, CommonQueryParams } from '~/types/query-params.type'

const BOARD_API_URL = '/boards' as const

const reducerPath = 'board/api' as const
const tagTypes = ['Board'] as const

export const boardApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    addBoard: build.mutation<BoardResType, CreateBoardBodyType>({
      query: (body) => ({ url: BOARD_API_URL, method: 'POST', data: body }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const board = data.result

          dispatch(
            workspaceApi.util.invalidateTags([
              { type: 'Workspace', id: board?.workspace_id },
              { type: 'Workspace', id: 'LIST' }
            ])
          )
        } catch (error) {
          toast.error('There was an error creating the board')
          console.error(error)
        }
      },
      invalidatesTags: [{ type: 'Board', id: 'LIST' }]
    }),

    getBoards: build.query<BoardListResType, BoardQueryParams>({
      query: (params) => ({ url: BOARD_API_URL, method: 'GET', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.boards.map(({ _id }) => ({ type: 'Board' as const, id: _id })),
              { type: 'Board' as const, id: 'LIST' }
            ]
          : [{ type: 'Board' as const, id: 'LIST' }]
    }),

    getJoinedWorkspaceBoards: build.query<BoardListResType, CommonQueryParams & { workspace_id: string }>({
      query: (params) => ({ url: `${BOARD_API_URL}/workspace/${params.workspace_id}`, method: 'GET', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.boards.map(({ _id }) => ({ type: 'Board' as const, id: _id })),
              { type: 'Board' as const, id: 'LIST' }
            ]
          : [{ type: 'Board' as const, id: 'LIST' }]
    }),

    updateBoard: build.mutation<BoardResType, { id: string; body: UpdateBoardBodyType }>({
      query: ({ id, body }) => ({ url: `${BOARD_API_URL}/${id}`, method: 'PUT', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          toast.error('There was an error updating the board')
          console.error(error)
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Board', id },
        { type: 'Board', id: 'LIST' }
      ]
    }),

    leaveBoard: build.mutation<BoardResType, string>({
      query: (id) => ({ url: `${BOARD_API_URL}/${id}/members/me/leave`, method: 'POST' }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(workspaceApi.util.invalidateTags([{ type: 'Workspace', id: 'LIST' }]))
        } catch (error) {
          console.error(error)
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Board', id },
        { type: 'Board', id: 'LIST' }
      ]
    })
  })
})

export const {
  useAddBoardMutation,
  useGetBoardsQuery,
  useLazyGetBoardsQuery,
  useUpdateBoardMutation,
  useLeaveBoardMutation,
  useGetJoinedWorkspaceBoardsQuery
} = boardApi

const boardApiReducer = boardApi.reducer

export default boardApiReducer
