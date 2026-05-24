import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from '@/features/auth/slices/authSlice'
import { workspaceReducer } from '@/features/workspace/slices/workspaceSlice'
import { socialAccountReducer } from '@/features/social-account/slices/socialAccountSlice'
import { mediaReducer } from '@/features/media/slices/mediaSlice'
import { postReducer } from '@/features/post/slices/postSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  workspaces: workspaceReducer,
  socialAccounts: socialAccountReducer,
  media: mediaReducer,
  posts: postReducer,
})

export type RootState = ReturnType<typeof rootReducer>
