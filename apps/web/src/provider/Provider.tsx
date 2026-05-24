import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import type { ReactNode } from 'react'
import { createStore, createPersistor } from '@/config/create-store'
import { dependencies, httpProvider } from '@/config/extraArgument'
import { setupAuthListeners } from '@/features/auth/listeners/authListeners'
import { registerPostListeners } from '@/features/post/listeners/postListeners'
import { registerMediaListeners } from '@/features/media/listeners/mediaListeners'
import { selectCurrentWorkspaceId } from '@/features/workspace/slices/workspaceSelectors'
import { selectAccessToken } from '@/features/auth/slices/authSelectors'
import { setTokens, clearSession } from '@/features/auth/infra/tokenStorage'

export const store = createStore(dependencies)
const persistor = createPersistor(store)
setupAuthListeners()
registerPostListeners()
registerMediaListeners()

// Sync workspaceId and access token from Redux → runtime singletons on every store change.
// This handles both initial rehydration from redux-persist and runtime switches.
let lastWorkspaceId: string | null = null
let lastAccessToken: string | null = null
store.subscribe(() => {
  const state = store.getState()

  const id = selectCurrentWorkspaceId(state) ?? null
  if (id !== lastWorkspaceId) {
    lastWorkspaceId = id
    httpProvider.setWorkspaceId(id)
  }

  const token = selectAccessToken(state) ?? null
  if (token !== lastAccessToken) {
    lastAccessToken = token
    if (token) {
      setTokens({ accessToken: token, refreshToken: '' })
    } else {
      clearSession()
    }
  }
})

interface Props {
  children: ReactNode
}

export const Provider = ({ children }: Props) => (
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </ReduxProvider>
)
