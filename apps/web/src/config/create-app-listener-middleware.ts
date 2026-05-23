import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'
import type { RootState } from './create-store'
import type { AppDispatch } from './create-store'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()
export const addAppListener = addListener.withTypes<RootState, AppDispatch>()
