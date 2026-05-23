import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import type { ReactNode } from 'react'
import { createStore, createPersistor } from '@/config/create-store'
import { dependencies } from '@/config/extraArgument'
import { setupAuthListeners } from '@/features/auth/listeners/authListeners'

const store = createStore(dependencies)
const persistor = createPersistor(store)
setupAuthListeners()

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
