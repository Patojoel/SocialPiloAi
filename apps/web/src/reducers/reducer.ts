import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from '@/features/auth/slices/authSlice'
import { workspaceReducer } from '@/features/workspace/slices/workspaceSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  workspaces: workspaceReducer,
})

export type RootState = ReturnType<typeof rootReducer>
