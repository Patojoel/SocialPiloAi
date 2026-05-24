import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useAppSelector } from '@/config/hooks'
import { selectAllMedia } from '../../../slices/mediaSelectors'
import { MediaLibrary } from './MediaLibrary'

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedIds: string[]) => void
  initialSelectedIds?: string[]
}

export function MediaPicker({ isOpen, onClose, onConfirm, initialSelectedIds = [] }: MediaPickerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds)
  const items = useAppSelector(selectAllMedia)

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleConfirm = () => {
    onConfirm(selectedIds)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Select Media</h2>
            <p className="text-sm text-gray-500">{selectedIds.length} selected</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <MediaLibrary
            items={items}
            selectable
            selectedIds={selectedIds}
            onSelect={handleToggle}
          />
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white',
              'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
              'transition-all duration-200 shadow-lg shadow-indigo-500/30',
            )}
          >
            <Check className="w-4 h-4" />
            Confirm ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  )
}
