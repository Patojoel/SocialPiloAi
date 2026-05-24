import { cn } from '@/shared/utils/cn'
import { Trash2, Image, Video } from 'lucide-react'
import type { Media } from '../../../models/Media'

interface MediaLibraryProps {
  items: Media[]
  selectable?: boolean
  selectedIds?: string[]
  onSelect?: (id: string) => void
  onDelete?: (id: string) => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}
export function MediaLibrary({ items, selectable = false, selectedIds = [], onSelect, onDelete }: MediaLibraryProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Image className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No media yet</p>
        <p className="text-gray-400 text-sm mt-1">Upload images or videos to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id)
        return (
          <div
            key={item.id}
            onClick={() => selectable && onSelect?.(item.id)}
            className={cn(
              'group relative rounded-xl overflow-hidden border-2 transition-all duration-200',
              'hover:scale-105 hover:shadow-xl cursor-pointer',
              isSelected
                ? 'border-indigo-500 shadow-indigo-500/30 shadow-lg'
                : 'border-transparent hover:border-gray-300',
              selectable && 'cursor-pointer',
            )}
          >
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <Video className="w-10 h-10 text-gray-400" />
                </div>
              )}

              {selectable && (
                <div
                  className={cn(
                    'absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                    isSelected
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'bg-white/80 border-gray-300 group-hover:border-indigo-400',
                  )}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {onDelete && !selectable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item.id)
                  }}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            <div className="px-2 py-1.5 bg-white">
              <p className="text-xs font-medium text-gray-700 truncate">{item.filename}</p>
              <p className="text-xs text-gray-400">{formatBytes(item.size)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
