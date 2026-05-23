import { createContext, useContext, type ReactNode } from 'react'
import type { AppStore } from '@/config/create-store'

const StoreContext = createContext<AppStore | null>(null)

interface Props {
  store: AppStore
  children: ReactNode
}

export const ReduxStoreProvider = ({ store, children }: Props) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
)

export const useStore = (): AppStore => {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used within ReduxStoreProvider')
  return store
}
