import { useRef, useState, useCallback } from 'react'
import { cn } from '@/shared/utils/cn'
import { Upload, Image, Video, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { uploadMedia } from '../../../usecases/uploadMedia.usecase'
import { selectIsUploading, selectMediaUploadError } from '../../../slices/mediaSelectors'
import { LoadingState } from '@/shared/models/LoadingState'
import { selectMediaUploading } from '../../../slices/mediaSelectors'

interface FilePreview {
  file: File
  previewUrl: string
  type: 'image' | 'video'
}

export function MediaUploader() {
  const dispatch = useAppDispatch()
  const isUploading = useAppSelector(selectIsUploading)
  const uploadingState = useAppSelector(selectMediaUploading)
  const uploadError = useAppSelector(selectMediaUploadError)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<FilePreview | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const justSucceeded = uploadingState === LoadingState.success && !preview

  const handleFile = useCallback((file: File) => {
    const isVideo = file.type.startsWith('video/')
    const previewUrl = URL.createObjectURL(file)
    setPreview({ file, previewUrl, type: isVideo ? 'video' : 'image' })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview.previewUrl)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleUpload = () => {
    if (!preview || isUploading) return
    void dispatch(uploadMedia(preview.file)).then((result) => {
      if (uploadMedia.fulfilled.match(result)) {
        clearPreview()
      }
    })
  }

  // Drop zone (no file selected)
  if (!preview) {
    return (
      <div className="space-y-3">
        {justSucceeded && (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Uploaded successfully — added to your library below.</span>
          </div>
        )}
        {uploadError && !preview && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 text-center select-none',
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
              : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/20',
          )}
        >
          <div
            className={cn(
              'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
              'bg-gradient-to-br from-indigo-500/10 to-purple-500/10',
              isDragging && 'opacity-100',
            )}
          />
          <div className="relative space-y-3">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Upload className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-700">Drop your media here</p>
              <p className="text-sm text-gray-500 mt-1">
                or <span className="text-indigo-600 font-medium">browse files</span>
              </p>
            </div>
            <div className="flex justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" />
                JPG, PNG, GIF, WebP — up to 10 MB
              </span>
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                MP4 — up to 200 MB
              </span>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      </div>
    )
  }

  // Preview + upload CTA
  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
      <button
        onClick={clearPreview}
        disabled={isUploading}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors disabled:opacity-50"
      >
        <X className="w-4 h-4 text-white" />
      </button>

      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {preview.type === 'image' ? (
          <img
            src={preview.previewUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            src={preview.previewUrl}
            className="w-full h-full object-contain bg-gray-900"
            controls
          />
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <p className="text-white text-sm font-medium">Uploading to Cloudinary…</p>
          </div>
        )}
      </div>

      <div className="p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">{preview.file.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {(preview.file.size / 1024 / 1024).toFixed(2)} MB · {preview.type}
          </p>
        </div>
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={cn(
            'shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
            'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30',
            'hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/40',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          )}
        >
          {isUploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </div>
  )
}
