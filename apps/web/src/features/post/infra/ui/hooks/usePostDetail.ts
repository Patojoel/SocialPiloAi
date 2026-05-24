import { useAppSelector } from '@/config/hooks'
import { selectCurrentPost } from '../../../slices/postSelectors'

export function usePostDetail() {
  const post = useAppSelector(selectCurrentPost)
  return { post }
}
