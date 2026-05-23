import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { register } from '@/features/auth/usecases/register/register.usecase'
import { selectAuthError, selectIsAuthPending } from '@/features/auth/slices/authSelectors'
import { registerSchema, type RegisterFormValues } from '../validation/authSchema'

export const useRegister = () => {
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectAuthError)
  const isPending = useAppSelector(selectIsAuthPending)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', firstName: '', lastName: '' },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await dispatch(
      register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      }),
    )
  })

  return { form, handleSubmit, error, isPending }
}
