import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { LoadingState } from '@/shared/models/LoadingState'
import type { SocialAccount } from '../models/SocialAccount'
import { listSocialAccounts } from '../usecases/listSocialAccounts.usecase'
import { disconnectSocialAccount } from '../usecases/disconnectSocialAccount.usecase'
import { initOAuthConnection } from '../usecases/initOAuthConnection.usecase'

const socialAccountAdapter = createEntityAdapter<SocialAccount>()

export interface SocialAccountState {
  loading: LoadingState
  error: string | null
}

const initialState = socialAccountAdapter.getInitialState<SocialAccountState>({
  loading: LoadingState.idle,
  error: null,
})

const socialAccountSlice = createSlice({
  name: 'socialAccounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listSocialAccounts.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(listSocialAccounts.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        socialAccountAdapter.setAll(state, action.payload)
      })
      .addCase(listSocialAccounts.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Failed to load social accounts'
      })
      .addCase(disconnectSocialAccount.fulfilled, (state, action) => {
        socialAccountAdapter.removeOne(state, action.payload)
      })
      .addCase(disconnectSocialAccount.rejected, (state, action) => {
        state.error = action.payload?.message ?? 'Failed to disconnect account'
      })
      .addCase(initOAuthConnection.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(initOAuthConnection.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Failed to initiate OAuth'
      })
  },
})

export const socialAccountReducer = socialAccountSlice.reducer
export const socialAccountAdapterSelectors = socialAccountAdapter.getSelectors()
