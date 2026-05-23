import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useAppDispatch } from '@/config/hooks'
import { forgotPassword } from '@/features/auth/usecases/forgotPassword/forgotPassword.usecase'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../validation/authSchema'

export const useForgotPassword = () => {
  const dispatch = useAppDispatch()
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await dispatch(forgotPassword(values))
    setSubmitted(true)
  })

  return { form, handleSubmit, submitted }
}
