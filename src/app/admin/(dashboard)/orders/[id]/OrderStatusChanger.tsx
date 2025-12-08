'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

interface OrderStatusChangerProps {
  orderId: string
  currentStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
}

const statuses = [
  { value: 'PENDING', label: 'Na čekanju', color: 'amber' },
  { value: 'CONFIRMED', label: 'Potvrđeno', color: 'blue' },
  { value: 'COMPLETED', label: 'Završeno', color: 'green' },
  { value: 'CANCELLED', label: 'Otkazano', color: 'red' },
] as const

export default function OrderStatusChanger({ orderId, currentStatus }: OrderStatusChangerProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return
    
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        setStatus(newStatus as typeof currentStatus)
        router.refresh()
      } else {
        alert('Greška pri promeni statusa')
      }
    } catch {
      alert('Greška pri promeni statusa')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
        <h2 className="text-lg font-semibold text-white">Promeni Status</h2>
      </div>
      <div className="p-4 space-y-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => handleStatusChange(s.value)}
            disabled={saving}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              status === s.value
                ? s.color === 'amber' ? 'bg-amber-500/20 border-amber-500/50 border' :
                  s.color === 'blue' ? 'bg-blue-500/20 border-blue-500/50 border' :
                  s.color === 'green' ? 'bg-green-500/20 border-green-500/50 border' :
                  'bg-red-500/20 border-red-500/50 border'
                : 'bg-neutral-800 hover:bg-neutral-700 border border-transparent'
            } disabled:opacity-50`}
          >
            <span className={`font-medium ${
              status === s.value
                ? s.color === 'amber' ? 'text-amber-500' :
                  s.color === 'blue' ? 'text-blue-500' :
                  s.color === 'green' ? 'text-green-500' :
                  'text-red-500'
                : 'text-neutral-300'
            }`}>
              {s.label}
            </span>
            {status === s.value && (
              <Check className={`w-5 h-5 ${
                s.color === 'amber' ? 'text-amber-500' :
                s.color === 'blue' ? 'text-blue-500' :
                s.color === 'green' ? 'text-green-500' :
                'text-red-500'
              }`} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
