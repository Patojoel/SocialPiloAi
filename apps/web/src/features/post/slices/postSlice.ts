import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { LoadingState } from '@/shared/models/LoadingState'
import type { Post, PostStatus, Platform } from '../models/Post'
import { listPosts } from '../usecases/listPosts.usecase'
import { getPostById } from '../usecases/getPostById.usecase'
import { createPost } from '../usecases/createPost.usecase'
import { updatePost } from '../usecases/updatePost.usecase'
import { deletePost } from '../usecases/deletePost.usecase'
import { publishNow } from '../usecases/publishNow.usecase'
import { schedulePost } from '../usecases/schedulePost.usecase'
import { duplicatePost } from '../usecases/duplicatePost.usecase'
import { pollPostStatus } from '../usecases/pollPostStatus.usecase'

const postAdapter = createEntityAdapter<Post>()

export interface PostFilters {
  status?: PostStatus
  platform?: Platform
}

export interface PostMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PostState {
  loading: LoadingState
  error: string | null
  currentPostId: string | null
  filters: PostFilters
  meta: PostMeta
}

const initialState = postAdapter.getInitialState<PostState>({
  loading: LoadingState.idle,
  error: null,
  currentPostId: null,
  filters: {},
  meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
})

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCurrentPost(state, action: { payload: string | null }) {
      state.currentPostId = action.payload
    },
    setFilters(state, action: { payload: PostFilters }) {
      state.filters = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // listPosts
      .addCase(listPosts.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(listPosts.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        postAdapter.setAll(state, action.payload.items)
        state.meta = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        }
      })
      .addCase(listPosts.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Failed to load posts'
      })
      // getPostById
      .addCase(getPostById.fulfilled, (state, action) => {
        postAdapter.upsertOne(state, action.payload)
        state.currentPostId = action.payload.id
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.error = action.payload?.message ?? 'Failed to load post'
      })
      // createPost
      .addCase(createPost.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        postAdapter.addOne(state, action.payload)
        state.currentPostId = action.payload.id
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Failed to create post'
      })
      // updatePost
      .addCase(updatePost.fulfilled, (state, action) => {
        postAdapter.upsertOne(state, action.payload)
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload?.message ?? 'Failed to update post'
      })
      // deletePost
      .addCase(deletePost.fulfilled, (state, action) => {
        postAdapter.removeOne(state, action.payload)
        if (state.currentPostId === action.payload) state.currentPostId = null
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload?.message ?? 'Failed to delete post'
      })
      // publishNow
      .addCase(publishNow.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(publishNow.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        postAdapter.upsertOne(state, action.payload)
      })
      .addCase(publishNow.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Failed to publish post'
      })
      // schedulePost
      .addCase(schedulePost.fulfilled, (state, action) => {
        postAdapter.upsertOne(state, action.payload)
      })
      .addCase(schedulePost.rejected, (state, action) => {
        state.error = action.payload?.message ?? 'Failed to schedule post'
      })
      // duplicatePost
      .addCase(duplicatePost.fulfilled, (state, action) => {
        postAdapter.addOne(state, action.payload)
      })
      .addCase(duplicatePost.rejected, (state, action) => {
        state.error = action.payload?.message ?? 'Failed to duplicate post'
      })
      // pollPostStatus
      .addCase(pollPostStatus.fulfilled, (state, action) => {
        postAdapter.upsertOne(state, action.payload)
      })
  },
})

export const { setCurrentPost, setFilters, clearError } = postSlice.actions
export const postReducer = postSlice.reducer
export const postAdapterSelectors = postAdapter.getSelectors()
