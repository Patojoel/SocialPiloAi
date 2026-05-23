import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { rootReducer } from '@/reducers/reducer'
import { listenerMiddleware } from './create-app-listener-middleware'
import type { Dependencies } from './dependencies'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'workspaces'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export function createStore(dependencies: Dependencies) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: dependencies },
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).prepend(listenerMiddleware.middleware),
  })
}

export type AppStore = ReturnType<typeof createStore>
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<AppStore['getState']>

export function createPersistor(store: AppStore) {
  return persistStore(store)
}
