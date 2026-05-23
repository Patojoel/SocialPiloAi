import type { RootState } from '@/config/create-store'
import { LoadingState } from '@/shared/models/LoadingState'

export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthError = (state: RootState) => state.auth.error
export const selectIsAuthPending = (state: RootState) => state.auth.loading === LoadingState.pending
