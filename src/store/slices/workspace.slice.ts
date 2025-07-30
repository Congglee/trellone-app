import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WorkspaceResType } from '~/schemas/workspace.schema'

type WorkspaceType = WorkspaceResType['result']

interface WorkspaceSliceState {
  workspaces: WorkspaceType[]
}

const initialState: WorkspaceSliceState = {
  workspaces: []
}

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<WorkspaceType[]>) => {
      state.workspaces = action.payload
    },

    appendWorkspaces: (state, action: PayloadAction<WorkspaceType[]>) => {
      // Append new workspaces while avoiding duplicates
      const newWorkspaces = action.payload.filter(
        (newWorkspace) => !state.workspaces.some((existingWorkspace) => existingWorkspace._id === newWorkspace._id)
      )
      state.workspaces = [...state.workspaces, ...newWorkspaces]
    },

    addWorkspace: (state, action: PayloadAction<WorkspaceType>) => {
      const incomingWorkspace = action.payload
      // Add to the beginning of the list (for newly created workspaces)
      state.workspaces.unshift(incomingWorkspace)
    },

    updateWorkspace: (state, action: PayloadAction<WorkspaceType>) => {
      const updatedWorkspace = action.payload
      const index = state.workspaces.findIndex((workspace) => workspace._id === updatedWorkspace._id)
      if (index !== -1) {
        state.workspaces[index] = updatedWorkspace
      }
    },

    removeWorkspace: (state, action: PayloadAction<string>) => {
      const workspaceId = action.payload
      state.workspaces = state.workspaces.filter((workspace) => workspace._id !== workspaceId)
    },

    clearWorkspaces: (state) => {
      state.workspaces = []
    }
  }
})

export const { setWorkspaces, appendWorkspaces, addWorkspace, updateWorkspace, removeWorkspace, clearWorkspaces } =
  workspaceSlice.actions

const workspaceReducer = workspaceSlice.reducer

export default workspaceReducer
