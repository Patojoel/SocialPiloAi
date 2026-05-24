import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, X, ImageIcon, Video, Plus } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Controller } from 'react-hook-form'
import { useCreatePost } from '../hooks/useCreatePost'
import { PostEditor } from '../components/PostEditor'
import { PlatformSelector } from '../components/PlatformSelector'
import { SchedulePicker } from '../components/SchedulePicker'
import { PublishActions } from '../components/PublishActions'
import { MediaPicker } from '@/features/media/infra/ui/components/MediaPicker'
import { PostRoutes } from '../../routes/postRoutes'
import type { Platform } from '../../../models/Post'
import { useAppSelector } from '@/config/hooks'
import { selectMediaByIds } from '@/features/media/slices/mediaSelectors'
import { selectCurrentPost } from '../../../slices/postSelectors'
import { PostFormFactory } from '../../factories/PostFormFactory'

const platformColors: Record<Platform, string> = {
  facebook: 'bg-blue-600',
  instagram: 'bg-gradient-to-br from-pink-600 to-purple-500',
  tiktok: 'bg-slate-900',
}

const PostCreatePage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  const existingPost = useAppSelector(selectCurrentPost)
  const { form, loading, handleSubmit } = useCreatePost(isEditMode ? existingPost ?? undefined : undefined)
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)

  // When editing: reset form once the post loads from Redux (router loader is fire-and-forget)
  useEffect(() => {
    if (isEditMode && existingPost) {
      form.reset(PostFormFactory.buildFormValue(existingPost))
    }
  }, [isEditMode, existingPost?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form

  const content = watch('content')
  const platforms = watch('platforms') as Platform[]
  const scheduledAt = watch('scheduledAt')
  const mediaIds = watch('mediaIds') ?? []
  const selectedMedia = useAppSelector(selectMediaByIds(mediaIds))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(PostRoutes.LIST)}
          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Post' : 'Create Post'}</h1>
          <p className="text-sm text-gray-500">Craft and publish your content across platforms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Editor panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <PostEditor
                registration={register('content')}
                value={content ?? ''}
                platforms={platforms ?? []}
                error={errors.content?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
              <Controller
                control={control}
                name="platforms"
                render={({ field }) => (
                  <PlatformSelector
                    selected={(field.value ?? []) as Platform[]}
                    onChange={field.onChange}
                    error={errors.platforms?.message}
                  />
                )}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Media</label>
                {selectedMedia.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Edit selection
                  </button>
                )}
              </div>

              {selectedMedia.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedMedia.map((item) => (
                      <div key={item.id} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                        {item.type === 'image' ? (
                          <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            <Video className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setValue('mediaIds', mediaIds.filter((id) => id !== item.id))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 flex items-center justify-center shrink-0 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-gray-400 hover:text-indigo-500" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">{selectedMedia.length} file{selectedMedia.length !== 1 ? 's' : ''} selected</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className={cn(
                    'w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium',
                    'border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-600',
                    'transition-all duration-200 flex items-center justify-center gap-2',
                  )}
                >
                  <ImageIcon className="w-4 h-4" />
                  Add media from library
                </button>
              )}

              <MediaPicker
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onConfirm={(ids) => setValue('mediaIds', ids)}
                initialSelectedIds={mediaIds}
              />
            </div>

            <SchedulePicker
              registration={register('scheduledAt')}
              value={scheduledAt}
              error={errors.scheduledAt?.message}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <PublishActions
              loading={loading}
              onAction={handleSubmit}
              hasScheduledAt={!!scheduledAt}
            />
          </div>
        </div>

        {/* Preview panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Preview</h3>
            <div className="space-y-4">
              {(platforms ?? []).length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">
                  Select a platform to see the preview
                </div>
              ) : (
                (platforms ?? []).map((platform) => (
                  <div key={platform} className="rounded-xl overflow-hidden border border-gray-100">
                    <div className={cn('px-4 py-2.5 text-white text-xs font-bold capitalize', platformColors[platform])}>
                      {platform}
                    </div>
                    <div className="p-4 bg-gray-50">
                      {content ? (
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {content.length > 280
                            ? platform === 'tiktok' || platform === 'instagram'
                              ? `${content.slice(0, 280)}...`
                              : content
                            : content}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Your content will appear here...</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCreatePage
