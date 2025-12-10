'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'

interface MenuFormProps {
  menu?: {
    id: string
    name: string
    dishCount: number
    price: string | null
  }
}

export default function MenuForm({ menu }: MenuFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: menu?.name || '',
    dishCount: menu?.dishCount || 5,
    price: menu?.price || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = menu ? `/api/admin/menus/${menu.id}` : '/api/admin/menus'
      const method = menu ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      })

      if (res.ok) {
        toast.success(menu ? 'Meni uspešno izmenjen' : 'Meni uspešno kreiran')
        router.push('/admin/menus')
        router.refresh()
      } else {
        toast.error('Greška pri čuvanju')
      }
    } catch {
      toast.error('Greška pri čuvanju')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/menus"
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">
              {menu ? 'Izmeni Meni' : 'Novi Meni'}
            </h1>
            <p className="text-neutral-500 mt-1">
              {menu ? 'Ažurirajte detalje menija' : 'Kreirajte novi paket menija'}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Čuvanje...' : 'Sačuvaj'}
        </button>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Ime menija *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              placeholder="npr. Premium Meni"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Broj jela u meniju *
            </label>
            <select
              value={formData.dishCount}
              onChange={(e) => setFormData({ ...formData, dishCount: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            >
              <option value={5}>5 jela</option>
              <option value={7}>7 jela</option>
              <option value={10}>10 jela</option>
              <option value={12}>12 jela</option>
              <option value={15}>15 jela</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Cena po osobi (RSD)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              placeholder="npr. 1500"
            />
            <p className="text-xs text-neutral-500 mt-2">Ostavite prazno za &quot;cena po dogovoru&quot;</p>
          </div>
        </div>
      </div>
    </form>
  )
}
