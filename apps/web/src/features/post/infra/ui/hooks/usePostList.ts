import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { selectAllPosts, selectPostsLoading, selectPostsMeta, selectPostsFilters } from '../../../slices/postSelectors'
import { setFilters } from '../../../slices/postSlice'
import { listPosts } from '../../../usecases/listPosts.usecase'
import { deletePost } from '../../../usecases/deletePost.usecase'
import { duplicatePost } from '../../../usecases/duplicatePost.usecase'
import type { PostStatus, Platform } from '../../../models/Post'

export function usePostList() {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectAllPosts)
  const loading = useAppSelector(selectPostsLoading)
  const meta = useAppSelector(selectPostsMeta)
  const filters = useAppSelector(selectPostsFilters)

  const handleRefresh = () => {
    void dispatch(listPosts({ page: meta.page, limit: meta.limit, ...filters }))
  }

  const handlePageChange = (page: number) => {
    void dispatch(listPosts({ page, limit: meta.limit, ...filters }))
  }

  const handleStatusFilter = (status: PostStatus | undefined) => {
    const newFilters = { ...filters, status }
    dispatch(setFilters(newFilters))
    void dispatch(listPosts({ page: 1, limit: meta.limit, ...newFilters }))
  }

  const handlePlatformFilter = (platform: Platform | undefined) => {
    const newFilters = { ...filters, platform }
    dispatch(setFilters(newFilters))
    void dispatch(listPosts({ page: 1, limit: meta.limit, ...newFilters }))
  }

  const handleDelete = (id: string) => {
    void dispatch(deletePost(id))
  }

  const handleDuplicate = (id: string) => {
    void dispatch(duplicatePost(id))
  }

  return {
    posts,
    loading,
    meta,
    filters,
    handleRefresh,
    handlePageChange,
    handleStatusFilter,
    handlePlatformFilter,
    handleDelete,
    handleDuplicate,
  }
}
