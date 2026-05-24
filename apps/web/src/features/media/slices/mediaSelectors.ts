import type { RootState } from '@/config/create-store'
import { mediaAdapterSelectors } from './mediaSlice'
import { LoadingState } from '@/shared/models/LoadingState'

const selectMediaState = (state: RootState) => state.media

export const selectAllMedia = (state: RootState) =>
  mediaAdapterSelectors.selectAll(selectMediaState(state))

export const selectMediaLoading = (state: RootState) => selectMediaState(state).loading
export const selectMediaUploading = (state: RootState) => selectMediaState(state).uploading
export const selectMediaError = (state: RootState) => selectMediaState(state).error
export const selectMediaUploadError = (state: RootState) => selectMediaState(state).uploadError
export const selectMediaMeta = (state: RootState) => selectMediaState(state).meta
export const selectIsMediaLoading = (state: RootState) =>
  selectMediaState(state).loading === LoadingState.pending
export const selectIsUploading = (state: RootState) =>
  selectMediaState(state).uploading === LoadingState.pending

export const selectMediaByIds = (ids: string[]) => (state: RootState) =>
  ids.map((id) => mediaAdapterSelectors.selectById(selectMediaState(state), id)).filter((m): m is NonNullable<typeof m> => m != null)
