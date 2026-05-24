import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { LoadingState } from '@/shared/models/LoadingState'
import type { Media } from '../models/Media'
import { uploadMedia } from '../usecases/uploadMedia.usecase'
import { listMedia } from '../usecases/listMedia.usecase'
import { deleteMedia } from '../usecases/deleteMedia.usecase'

const mediaAdapter = createEntityAdapter<Media>()

export interface MediaState {
  loading: LoadingState
  uploading: LoadingState
  error: string | null
  uploadError: string | null
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const initialState = mediaAdapter.getInitialState<MediaState>({
  loading: LoadingState.idle,
  uploading: LoadingState.idle,
  error: null,
  uploadError: null,
  meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
})

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listMedia.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(listMedia.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        mediaAdapter.setAll(state, action.payload.items)
        state.meta = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        }
      })
      .addCase(listMedia.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Failed to load media'
      })
      .addCase(uploadMedia.pending, (state) => {
        state.uploading = LoadingState.pending
        state.uploadError = null
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.uploading = LoadingState.success
        // Add immediately for instant feedback; listener will sync full list from server
        mediaAdapter.upsertOne(state, action.payload)
        state.meta.total += 1
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.uploading = LoadingState.failed
        state.uploadError = action.payload?.message ?? 'Upload failed'
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        mediaAdapter.removeOne(state, action.payload)
        state.meta.total = Math.max(0, state.meta.total - 1)
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.error = action.payload?.message ?? 'Failed to delete media'
      })
  },
})

export const mediaReducer = mediaSlice.reducer
export const mediaAdapterSelectors = mediaAdapter.getSelectors()
