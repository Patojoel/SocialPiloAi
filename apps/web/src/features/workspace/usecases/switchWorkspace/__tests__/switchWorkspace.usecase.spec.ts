import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { switchWorkspace } from '../switchWorkspace.usecase'
import { workspaceReducer } from '../../../slices/workspaceSlice'
import type { AuthGateway } from '@/features/auth/gateway/AuthGateway'
import type { WorkspaceGateway } from '../../../gateway/WorkspaceGateway'

vi.mock('@/config/extraArgument', () => ({
  httpProvider: { setWorkspaceId: vi.fn() },
}))

const mockWorkspaceGateway: WorkspaceGateway = {
  list: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

const mockAuthGateway: AuthGateway = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  me: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  updateProfile: vi.fn(),
}

function createTestStore() {
  return configureStore({
    reducer: { workspaces: workspaceReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { authGateway: mockAuthGateway, workspaceGateway: mockWorkspaceGateway },
        },
      }),
  })
}

describe('switchWorkspace usecase', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    vi.clearAllMocks()
  })

  it('should update currentId in store', async () => {
    await store.dispatch(switchWorkspace('ws-abc'))
    expect(store.getState().workspaces.currentId).toBe('ws-abc')
  })
})
