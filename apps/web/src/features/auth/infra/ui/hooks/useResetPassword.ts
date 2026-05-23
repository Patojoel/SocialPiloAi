import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '@/config/hooks'
import { resetPassword } from '@/features/auth/usecases/resetPassword/resetPassword.usecase'
import { ResetPasswordFormValues, resetPasswordSchema } from '../../validation/authSchema'

export const useResetPassword = (token: string) => {
  const dispatch = useAppDispatch()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await dispatch(resetPassword({ token, password: values.password }))
  })

  return { form, handleSubmit }
}
