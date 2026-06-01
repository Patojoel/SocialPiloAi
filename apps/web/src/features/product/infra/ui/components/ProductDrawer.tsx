import { useRef } from 'react'
import { useFieldArray } from 'react-hook-form'
import { X, Plus, Trash2, Loader2, ImageIcon, Video, Upload, Link } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { LoadingState } from '@/shared/models/LoadingState'
import type { UseFormReturn } from 'react-hook-form'
import type { ProductFormValues } from '../../validation/productSchema'

interface ProductDrawerProps {
  open: boolean
  isEditing: boolean
  loading: LoadingState
  isUploading: boolean
  form: UseFormReturn<ProductFormValues>
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
  onUploadFile: (file: File) => Promise<string | null>
}

// ─── Simple string-array field (URL text inputs) ─────────────────────────────

function UrlField({
  label,
  fieldName,
  form,
  placeholder,
}: {
  label: string
  fieldName: 'benefits' | 'marketingTexts'
  form: UseFormReturn<ProductFormValues>
  placeholder: string
}) {
  const values = form.watch(fieldName)

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">{label}</label>
      <div className="space-y-2">
        {values.map((_, index) => (
          <div key={index} className="flex gap-2">
            <input
              {...form.register(`${fieldName}.${index}` as `benefits.${number}`)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
            />
            <button
              type="button"
              onClick={() => {
                const current = form.getValues(fieldName) as string[]
                form.setValue(fieldName, current.filter((_, i) => i !== index) as never)
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const current = form.getValues(fieldName) as string[]
            form.setValue(fieldName, [...current, ''] as never)
          }}
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>
    </div>
  )
}

// ─── FAQs field ──────────────────────────────────────────────────────────────

function FaqsField({ form }: { form: UseFormReturn<ProductFormValues> }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'faqs' })

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">FAQs</label>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">FAQ {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              {...form.register(`faqs.${index}.question`)}
              placeholder="Question"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
            />
            <textarea
              {...form.register(`faqs.${index}.answer`)}
              placeholder="Answer"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all resize-none"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ question: '', answer: '' })}
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add FAQ
        </button>
      </div>
    </div>
  )
}

// ─── Media upload field (image or video) ─────────────────────────────────────

function MediaUploadField({
  label,
  fieldName,
  accept,
  icon,
  previewType,
  isUploading,
  form,
  onUploadFile,
}: {
  label: string
  fieldName: 'imageUrls' | 'videoUrls'
  accept: string
  icon: React.ReactNode
  previewType: 'image' | 'video'
  isUploading: boolean
  form: UseFormReturn<ProductFormValues>
  onUploadFile: (file: File) => Promise<string | null>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const urls = form.watch(fieldName)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = '' // reset so same file can be re-selected
    const url = await onUploadFile(file)
    if (url) {
      const current = form.getValues(fieldName)
      form.setValue(fieldName, [...current, url])
    }
  }

  const handleRemove = (index: number) => {
    const current = form.getValues(fieldName)
    form.setValue(fieldName, current.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
        {icon} {label}
      </label>

      {/* Preview grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {urls.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square">
              {previewType === 'image' ? (
                <img src={url} alt="" className="w-full h-full object-cover" />
              ) : (
                <video src={url} className="w-full h-full object-cover" muted />
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button + URL fallback */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {isUploading ? 'Uploading…' : 'Upload file'}
        </button>

        <button
          type="button"
          onClick={() => {
            const current = form.getValues(fieldName)
            form.setValue(fieldName, [...current, ''])
          }}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Link className="w-3.5 h-3.5" />
          Add URL
        </button>
      </div>

      {/* URL text inputs for manually added items (empty or existing URLs) */}
      {urls.map((url, index) =>
        url === '' ? (
          <div key={`url-${index}`} className="flex gap-2 mt-2">
            <input
              {...form.register(`${fieldName}.${index}`)}
              placeholder="https://..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null,
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────

export function ProductDrawer({ open, isEditing, loading, isUploading, form, onSubmit, onClose, onUploadFile }: ProductDrawerProps) {
  const isPending = loading === LoadingState.pending
  const errors = form.formState.errors

  const inputClass = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all'
  const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5'

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      )}

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {isEditing ? 'Edit product' : 'New product'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEditing ? 'Update the product marketing information' : 'Fill in the product marketing information'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Name */}
            <div>
              <label className={labelClass}>Product name *</label>
              <input
                {...form.register('name')}
                placeholder="e.g. Crème hydratante 24h"
                className={cn(inputClass, errors.name && 'border-red-300 focus:ring-red-200 focus:border-red-400')}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                {...form.register('description')}
                placeholder="Brief description of the product"
                rows={3}
                className={cn(inputClass, 'resize-none', errors.description && 'border-red-300')}
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>

            {/* Context */}
            <div>
              <label className={labelClass}>Context *</label>
              <textarea
                {...form.register('context')}
                placeholder="Target audience, use case, market positioning…"
                rows={3}
                className={cn(inputClass, 'resize-none', errors.context && 'border-red-300')}
              />
              {errors.context && <p className="mt-1 text-xs text-red-500">{errors.context.message}</p>}
            </div>

            {/* Benefits */}
            <UrlField label="Benefits" fieldName="benefits" form={form} placeholder="e.g. Hydratation longue durée" />

            {/* Marketing texts */}
            <UrlField label="Marketing texts" fieldName="marketingTexts" form={form} placeholder="e.g. La formule qui révolutionne votre peau" />

            {/* FAQs */}
            <FaqsField form={form} />

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Images */}
            <MediaUploadField
              label="Images"
              fieldName="imageUrls"
              accept="image/jpeg,image/png,image/gif,image/webp"
              icon={<ImageIcon className="inline w-3.5 h-3.5 mr-1 text-blue-400" />}
              previewType="image"
              isUploading={isUploading}
              form={form}
              onUploadFile={onUploadFile}
            />

            {/* Videos */}
            <MediaUploadField
              label="Videos"
              fieldName="videoUrls"
              accept="video/mp4,video/quicktime,video/webm"
              icon={<Video className="inline w-3.5 h-3.5 mr-1 text-violet-400" />}
              previewType="video"
              isUploading={isUploading}
              form={form}
              onUploadFile={onUploadFile}
            />

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending || isUploading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {(isPending || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save changes' : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
