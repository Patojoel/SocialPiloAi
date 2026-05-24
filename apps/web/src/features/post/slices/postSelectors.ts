import type { RootState } from '@/config/create-store'
import { postAdapterSelectors } from './postSlice'
import type { PostStatus } from '../models/Post'

const selectPostState = (state: RootState) => state.posts

export const selectAllPosts = (state: RootState) =>
  postAdapterSelectors.selectAll(selectPostState(state))

export const selectCurrentPost = (state: RootState) => {
  const id = selectPostState(state).currentPostId
  if (!id) return null
  return postAdapterSelectors.selectById(selectPostState(state), id) ?? null
}

export const selectPostsByStatus = (status: PostStatus) => (state: RootState) =>
  postAdapterSelectors.selectAll(selectPostState(state)).filter((p) => p.status === status)

export const selectPostsLoading = (state: RootState) => selectPostState(state).loading

export const selectPostsError = (state: RootState) => selectPostState(state).error

export const selectPostsMeta = (state: RootState) => selectPostState(state).meta

export const selectPostsFilters = (state: RootState) => selectPostState(state).filters

export const selectPostById = (id: string) => (state: RootState) =>
  postAdapterSelectors.selectById(selectPostState(state), id) ?? null
