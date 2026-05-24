import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from './create-store'
import type { Dependencies } from './dependencies'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  extra: Dependencies
  rejectValue: { message: string; status?: number }
}>()
