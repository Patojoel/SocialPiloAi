import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { createWorkspace } from '../createWorkspace.usecase'
import { workspaceReducer } from '../../../slices/workspaceSlice'
import type { AuthGateway } from '@/features/auth/gateway/AuthGateway'
import type { WorkspaceGateway } from '../../../gateway/WorkspaceGateway'
import type { Workspace } from '../../../models/Workspace'

const mockWorkspace: Workspace = {
  id: 'ws-1',
  name: 'Test Workspace',
  slug: 'test-workspace',
  logoUrl: null,
  ownerId: 'user-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockWorkspaceGateway: WorkspaceGateway = {
  list: vi.fn().mockResolvedValue([]),
  getById: vi.fn(),
  create: vi.fn().mockResolvedValue(mockWorkspace),
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

describe('createWorkspace usecase', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    vi.clearAllMocks()
    mockWorkspaceGateway.create = vi.fn().mockResolvedValue(mockWorkspace)
  })

  it('should add workspace to store', async () => {
    await store.dispatch(createWorkspace({ name: 'Test Workspace' }))
    const state = store.getState().workspaces
    expect(Object.keys(state.entities)).toContain('ws-1')
  })

  it('should set currentId on created workspace', async () => {
    await store.dispatch(createWorkspace({ name: 'Test Workspace' }))
    expect(store.getState().workspaces.currentId).toBe('ws-1')
  })
})
