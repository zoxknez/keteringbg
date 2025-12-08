'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

interface Dish {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  category: string
  isAvailable: boolean
  isVegetarian: boolean
  isVegan: boolean
  isFasting: boolean
}

interface DishesTableProps {
  dishes: Dish[]
}

const categoryLabels: Record<string, string> = {
  APPETIZER: 'Predjelo',
  MAIN: 'Glavno jelo',
  DESSERT: 'Dezert',
}

export default function DishesTable({ dishes }: DishesTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || dish.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovo jelo?')) return
    
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/dishes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Greška pri brisanju')
      }
    } catch {
      alert('Greška pri brisanju')
    } finally {
      setDeleting(null)
    }
  }

  const toggleAvailability = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/dishes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !currentValue })
      })
      if (res.ok) {
        router.refresh()
      }
    } catch {
      alert('Greška pri ažuriranju')
    }
  }

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-neutral-800 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Pretraži jela..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
        >
          <option value="">Sve kategorije</option>
          <option value="APPETIZER">Predjela</option>
          <option value="MAIN">Glavna jela</option>
          <option value="DESSERT">Deserti</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800 text-left">
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Slika</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Ime</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Kategorija</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Oznake</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Dostupno</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400 text-right">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filteredDishes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                  Nema jela za prikaz
                </td>
              </tr>
            ) : (
              filteredDishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4">
                    {dish.imageUrl ? (
                      <img 
                        src={dish.imageUrl} 
                        alt={dish.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center">
                        <span className="text-neutral-600 text-xl">🍽️</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{dish.name}</p>
                    {dish.description && (
                      <p className="text-sm text-neutral-500 truncate max-w-xs">{dish.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300">
                      {categoryLabels[dish.category] || dish.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {dish.isVegetarian && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-500">Veg</span>
                      )}
                      {dish.isVegan && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-500">Vegan</span>
                      )}
                      {dish.isFasting && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-500">Posno</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAvailability(dish.id, dish.isAvailable)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        dish.isAvailable 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                      }`}
                    >
                      {dish.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {dish.isAvailable ? 'Da' : 'Ne'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/dishes/${dish.id}`}
                        className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-white"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(dish.id)}
                        disabled={deleting === dish.id}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-neutral-400 hover:text-red-500 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
