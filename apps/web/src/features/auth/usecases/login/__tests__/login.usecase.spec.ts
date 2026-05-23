import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { login } from '../login.usecase'
import { authReducer } from '../../../slices/authSlice'
import { LoadingState } from '@/shared/models/LoadingState'
import type { AuthGateway } from '../../../gateway/AuthGateway'
import type { WorkspaceGateway } from '@/features/workspace/gateway/WorkspaceGateway'

const mockUser = {
  id: '1',
  email: 'test@test.com',
  firstName: 'John',
  lastName: 'Doe',
  avatarUrl: null,
}

const mockAuthGateway: AuthGateway = {
  login: vi.fn().mockResolvedValue({
    user: mockUser,
    accessToken: 'token',
    refreshToken: 'refresh',
    expiresIn: 900,
  }),
  register: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  me: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  updateProfile: vi.fn(),
}

const mockWorkspaceGateway: WorkspaceGateway = {
  list: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

function createTestStore() {
  return configureStore({
    reducer: { auth: authReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { authGateway: mockAuthGateway, workspaceGateway: mockWorkspaceGateway },
        },
      }),
  })
}

describe('login usecase', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    vi.clearAllMocks()
    mockAuthGateway.login = vi.fn().mockResolvedValue({
      user: mockUser,
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 900,
    })
  })

  it('should store user and set isAuthenticated on success', async () => {
    await store.dispatch(login({ email: 'test@test.com', password: 'password' }))
    const state = store.getState().auth
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(mockUser)
    expect(state.loading).toBe(LoadingState.success)
  })

  it('should set loading=pending during request', () => {
    mockAuthGateway.login = vi.fn(() => new Promise(() => {}))
    store.dispatch(login({ email: 'test@test.com', password: 'password' }))
    expect(store.getState().auth.loading).toBe(LoadingState.pending)
  })

  it('should set error on invalid credentials (401)', async () => {
    const { HttpError } = await import('@/shared/infra/http/HttpError')
    mockAuthGateway.login = vi.fn().mockRejectedValue(new HttpError(401, 'Invalid credentials'))
    await store.dispatch(login({ email: 'bad@test.com', password: 'wrong' }))
    const state = store.getState().auth
    expect(state.loading).toBe(LoadingState.failed)
    expect(state.error).toBe('Invalid credentials')
  })

  it('should set error on server error (500)', async () => {
    const { HttpError } = await import('@/shared/infra/http/HttpError')
    mockAuthGateway.login = vi.fn().mockRejectedValue(new HttpError(500, 'Internal Server Error'))
    await store.dispatch(login({ email: 'test@test.com', password: 'password' }))
    const state = store.getState().auth
    expect(state.loading).toBe(LoadingState.failed)
    expect(state.error).toBeTruthy()
  })
})
