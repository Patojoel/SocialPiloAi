import { useAppSelector, useAppDispatch } from '@/config/hooks'
import { selectCurrentUser } from '@/features/auth/slices/authSelectors'
import { updateProfile } from '@/features/auth/usecases/updateProfile/updateProfile.usecase'

export const useProfile = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)

  const handleUpdate = (data: { firstName?: string; lastName?: string; avatarUrl?: string | null }) => {
    dispatch(updateProfile(data))
  }

  return { user, handleUpdate }
}
