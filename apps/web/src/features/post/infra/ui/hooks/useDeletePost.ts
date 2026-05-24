import { useAppDispatch } from '@/config/hooks'
import { deletePost } from '../../../usecases/deletePost.usecase'
import { useNavigate } from 'react-router-dom'
import { PostRoutes } from '../../routes/postRoutes'

export function useDeletePost() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    void dispatch(deletePost(id)).then((result) => {
      if (deletePost.fulfilled.match(result)) {
        navigate(PostRoutes.LIST)
      }
    })
  }

  return { handleDelete }
}
