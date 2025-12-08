'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Save } from 'lucide-react'

interface Dish {
  id: string
  name: string
  category: string
  imageUrl: string | null
}

interface MenuDishesManagerProps {
  menuId: string
  menuDishCount: number
  selectedDishIds: string[]
  allDishes: Dish[]
}

const categoryLabels: Record<string, string> = {
  APPETIZER: 'Predjela',
  MAIN: 'Glavna Jela',
  DESSERT: 'Deserti',
}

export default function MenuDishesManager({ 
  menuId, 
  menuDishCount, 
  selectedDishIds: initialSelectedIds, 
  allDishes 
}: MenuDishesManagerProps) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds)
  const [saving, setSaving] = useState(false)

  const appetizers = allDishes.filter(d => d.category === 'APPETIZER')
  const mains = allDishes.filter(d => d.category === 'MAIN')
  const desserts = allDishes.filter(d => d.category === 'DESSERT')

  const toggleDish = (dishId: string) => {
    setSelectedIds(prev => 
      prev.includes(dishId) 
        ? prev.filter(id => id !== dishId)
        : [...prev, dishId]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/menus/${menuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishIds: selectedIds })
      })
      if (res.ok) {
        router.refresh()
        alert('Jela uspešno sačuvana!')
      } else {
        alert('Greška pri čuvanju')
      }
    } catch {
      alert('Greška pri čuvanju')
    } finally {
      setSaving(false)
    }
  }

  const renderDishCategory = (dishes: Dish[], title: string) => (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-neutral-500">
          {dishes.filter(d => selectedIds.includes(d.id)).length} izabrano
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {dishes.map(dish => {
          const isSelected = selectedIds.includes(dish.id)
          return (
            <button
              key={dish.id}
              onClick={() => toggleDish(dish.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'
              }`}
            >
              {dish.imageUrl ? (
                <img 
                  src={dish.imageUrl} 
                  alt={dish.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-neutral-700 flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
              )}
              <span className={`font-medium flex-1 ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                {dish.name}
              </span>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats & Save */}
      <div className="flex items-center justify-between bg-neutral-900 rounded-xl border border-neutral-800 p-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-neutral-500 text-sm">Izabrano jela</p>
            <p className={`text-2xl font-bold ${
              selectedIds.length === menuDishCount ? 'text-green-500' : 
              selectedIds.length > menuDishCount ? 'text-red-500' : 'text-amber-500'
            }`}>
              {selectedIds.length} / {menuDishCount}
            </p>
          </div>
          {selectedIds.length !== menuDishCount && (
            <p className="text-sm text-neutral-500">
              {selectedIds.length < menuDishCount 
                ? `Potrebno još ${menuDishCount - selectedIds.length} jela`
                : `Previše za ${selectedIds.length - menuDishCount} jela`
              }
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Čuvanje...' : 'Sačuvaj Izbor'}
        </button>
      </div>

      {/* Categories */}
      {renderDishCategory(appetizers, categoryLabels.APPETIZER)}
      {renderDishCategory(mains, categoryLabels.MAIN)}
      {renderDishCategory(desserts, categoryLabels.DESSERT)}
    </div>
  )
}
