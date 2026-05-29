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

// Read token directly from Redux store at request time — no sync lag after page reload.
httpProvider.setTokenGetter(() => selectAccessToken(store.getState()) ?? null)

// Sync workspaceId from Redux → httpProvider on every store change.
let lastWorkspaceId: string | null = null
store.subscribe(() => {
  const state = store.getState()

  const id = selectCurrentWorkspaceId(state) ?? null
  if (id !== lastWorkspaceId) {
    lastWorkspaceId = id
    httpProvider.setWorkspaceId(id)
  }

  // Keep tokenStorage in sync for any legacy code that reads from it directly.
  const token = selectAccessToken(state) ?? null
  if (token) {
    setTokens({ accessToken: token, refreshToken: '' })
  } else {
    clearSession()
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
