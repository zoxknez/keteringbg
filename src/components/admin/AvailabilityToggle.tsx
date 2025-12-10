'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface AvailabilityToggleProps {
  dish?: {
    id: string
    name: string
    isAvailable: boolean
  }
  action?: 'enableAll' | 'disableAll'
}

export default function AvailabilityToggle({ dish, action }: AvailabilityToggleProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [optimisticAvailable, setOptimisticAvailable] = useState(dish?.isAvailable)

  // Bulk actions
  if (action) {
    const handleBulkAction = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/dishes/availability', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        })
        if (res.ok) {
          toast.success(action === 'enableAll' ? 'Sva jela uključena' : 'Sva jela isključena')
          router.refresh()
        }
      } catch {
        toast.error('Greška')
      } finally {
        setLoading(false)
      }
    }

    return action === 'enableAll' ? (
      <button
        onClick={handleBulkAction}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl font-medium transition-colors disabled:opacity-50"
      >
        <CheckCircle className="w-5 h-5" />
        {loading ? 'Učitavanje...' : 'Uključi Sva'}
      </button>
    ) : (
      <button
        onClick={handleBulkAction}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors disabled:opacity-50"
      >
        <XCircle className="w-5 h-5" />
        {loading ? 'Učitavanje...' : 'Isključi Sva'}
      </button>
    )
  }

  // Individual dish toggle
  if (!dish) return null

  const handleToggle = async () => {
    const newValue = !optimisticAvailable
    setOptimisticAvailable(newValue)
    
    try {
      const res = await fetch(`/api/admin/dishes/${dish.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: newValue })
      })
      if (!res.ok) {
        setOptimisticAvailable(!newValue) // Revert
      }
    } catch {
      setOptimisticAvailable(!newValue) // Revert
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
        optimisticAvailable
          ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
          : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'
      }`}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        optimisticAvailable ? 'bg-green-500' : 'bg-neutral-600'
      }`}>
        {optimisticAvailable ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <X className="w-4 h-4 text-neutral-400" />
        )}
      </div>
      <span className={`font-medium ${optimisticAvailable ? 'text-white' : 'text-neutral-400'}`}>
        {dish.name}
      </span>
    </button>
  )
}
