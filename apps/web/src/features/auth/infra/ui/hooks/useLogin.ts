import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { login } from '@/features/auth/usecases/login/login.usecase'
import { selectAuthError, selectIsAuthPending } from '@/features/auth/slices/authSelectors'
import { loginSchema, type LoginFormValues } from '../validation/authSchema'

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectAuthError)
  const isPending = useAppSelector(selectIsAuthPending)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await dispatch(login(values))
  })

  return { form, handleSubmit, error, isPending }
}
