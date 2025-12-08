'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface MenuActionsProps {
  menuId: string
  menuName: string
}

export default function MenuActions({ menuId, menuName }: MenuActionsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Da li ste sigurni da želite da obrišete "${menuName}"?`)) return
    
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/menus/${menuId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Greška pri brisanju')
      }
    } catch {
      alert('Greška pri brisanju')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-neutral-400 hover:text-red-500 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
