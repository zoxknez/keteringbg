'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function OrderActions({ orderId }: { orderId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu narudžbinu?')) return

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Greška pri brisanju narudžbine')
      }
    } catch {
      alert('Greška pri brisanju narudžbine')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
      title="Obriši"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )
}
