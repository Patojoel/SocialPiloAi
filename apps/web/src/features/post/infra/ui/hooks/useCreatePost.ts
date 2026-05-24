import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { createPostSchema, type CreatePostFormValues } from '../../validation/postSchema'
import { PostFormFactory } from '../../factories/PostFormFactory'
import { PostCommandFactory } from '../../factories/PostCommandFactory'
import { createPost } from '../../../usecases/createPost.usecase'
import { publishNow } from '../../../usecases/publishNow.usecase'
import { schedulePost } from '../../../usecases/schedulePost.usecase'
import { selectPostsLoading } from '../../../slices/postSelectors'
import { PostRoutes } from '../../routes/postRoutes'
import type { Post } from '../../../models/Post'

type PublishAction = 'draft' | 'publish' | 'schedule'

export function useCreatePost(existingPost?: Post) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loading = useAppSelector(selectPostsLoading)

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: PostFormFactory.buildFormValue(existingPost),
  })

  const handleSubmit = (action: PublishAction) => {
    form.handleSubmit(async (values) => {
      const command = PostCommandFactory.buildCreateCommand(values)
      const result = await dispatch(createPost(command))

      if (!createPost.fulfilled.match(result)) return

      const postId = result.payload.id

      if (action === 'publish') {
        await dispatch(publishNow(postId))
      } else if (action === 'schedule' && values.scheduledAt) {
        const scheduleCmd = PostCommandFactory.buildScheduleCommand(values)
        await dispatch(schedulePost({ id: postId, scheduledAt: scheduleCmd.scheduledAt }))
      }

      navigate(PostRoutes.LIST)
    })()
  }

  return { form, loading, handleSubmit }
}
