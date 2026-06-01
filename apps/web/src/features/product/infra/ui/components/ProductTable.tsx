import { useState } from 'react'
import { Pencil, Trash2, ChevronUp, ChevronDown, ArrowUpDown, Package, ImageIcon, Video } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { Product } from '../../../models/Product'

type SortKey = 'name' | 'createdAt'
type SortDir = 'asc' | 'desc'

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" />
  return dir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-indigo-600" />
    : <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-gray-100 rounded-md animate-pulse" style={{ width: `${55 + (i * 15) % 40}%` }} />
        </td>
      ))}
    </tr>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface ProductTableProps {
  products: Product[]
  loading: boolean
  searchQuery: string
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export function ProductTable({ products, loading, searchQuery, onEdit, onDelete }: ProductTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = products.filter(
    (p) => searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sorted = [...filtered].sort((a, b) => {
    const valA = sortKey === 'name' ? a.name : a.createdAt
    const valB = sortKey === 'name' ? b.name : b.createdAt
    return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })

  const thClass = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80 group cursor-pointer select-none hover:text-gray-700 transition-colors'
  const thStatic = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80'

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={thClass} onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1.5">
                  Product
                  <SortIcon col="name" sortKey={sortKey} dir={sortDir} />
                </div>
              </th>
              <th className={thStatic}>Benefits</th>
              <th className={thStatic}>Media</th>
              <th className={thStatic}>Marketing texts</th>
              <th className={thClass} onClick={() => handleSort('createdAt')}>
                <div className="flex items-center gap-1.5">
                  Created
                  <SortIcon col="createdAt" sortKey={sortKey} dir={sortDir} />
                </div>
              </th>
              <th className={cn(thStatic, 'text-right')}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm">
                      {searchQuery ? 'No products match your search' : 'No products yet'}
                    </p>
                    {!searchQuery && (
                      <p className="text-gray-400 text-xs">Create your first product to get started</p>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {!loading && sorted.map((product) => (
              <tr key={product.id} className="hover:bg-indigo-50/30 transition-colors duration-100 group/row">
                {/* Product name + description */}
                <td className="px-4 py-3.5 max-w-[240px]">
                  <p className="text-gray-800 font-medium text-sm truncate">{product.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{product.description}</p>
                </td>

                {/* Benefits count */}
                <td className="px-4 py-3.5">
                  {product.benefits.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {product.benefits.length} benefit{product.benefits.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>

                {/* Media counts */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {product.imageUrls.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                        {product.imageUrls.length}
                      </span>
                    )}
                    {product.videoUrls.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Video className="w-3.5 h-3.5 text-violet-400" />
                        {product.videoUrls.length}
                      </span>
                    )}
                    {product.imageUrls.length === 0 && product.videoUrls.length === 0 && (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                </td>

                {/* Marketing texts */}
                <td className="px-4 py-3.5">
                  {product.marketingTexts.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {product.marketingTexts.length} text{product.marketingTexts.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>

                {/* Created */}
                <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                  {formatDate(product.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1 opacity-60 group-hover/row:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(product)}
                      title="Edit"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      title="Delete"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
