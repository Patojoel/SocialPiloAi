import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { selectAllMedia, selectMediaLoading, selectMediaMeta } from '../../../slices/mediaSelectors'
import { deleteMedia } from '../../../usecases/deleteMedia.usecase'
import { listMedia } from '../../../usecases/listMedia.usecase'

export function useMedia() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectAllMedia)
  const loading = useAppSelector(selectMediaLoading)
  const meta = useAppSelector(selectMediaMeta)

  const handleDelete = (id: string) => {
    void dispatch(deleteMedia(id))
  }

  const handlePageChange = (page: number) => {
    void dispatch(listMedia({ page, limit: meta.limit }))
  }

  return { items, loading, meta, handleDelete, handlePageChange }
}
