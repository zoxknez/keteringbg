'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function OrderDeleteButton({ orderId }: { orderId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu narudžbinu? Ova akcija se ne može poništiti.')) return

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/orders')
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
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-500 font-medium transition-colors"
    >
      <Trash2 className="w-5 h-5" />
      Obriši Narudžbinu
    </button>
  )
}
