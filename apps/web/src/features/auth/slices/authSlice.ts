import { createSlice } from '@reduxjs/toolkit'
import { LoadingState } from '@/shared/models/LoadingState'
import type { User } from '../models/Auth'
import { login } from '../usecases/login/login.usecase'
import { register } from '../usecases/register/register.usecase'
import { logout } from '../usecases/logout/logout.usecase'
import { fetchMe } from '../usecases/fetchMe/fetchMe.usecase'
import { updateProfile } from '../usecases/updateProfile/updateProfile.usecase'

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  loading: LoadingState
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: LoadingState.idle,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Login failed'
      })
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Registration failed'
      })
    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.loading = LoadingState.idle
        state.error = null
      })
    // FetchMe
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = LoadingState.pending
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = LoadingState.idle
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
      })
    // UpdateProfile
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { clearError } = authSlice.actions
export const authReducer = authSlice.reducer
