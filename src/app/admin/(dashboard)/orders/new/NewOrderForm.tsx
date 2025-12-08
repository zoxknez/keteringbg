'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Check } from 'lucide-react'

interface Menu {
  id: string
  name: string
  dishCount: number
}

interface Dish {
  id: string
  name: string
  category: string
}

interface NewOrderFormProps {
  menus: Menu[]
  dishes: Dish[]
}

export default function NewOrderForm({ menus, dishes }: NewOrderFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState('')
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([])
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    address: '',
    eventDate: '',
    message: '',
    portions: 1,
  })

  const selectedMenu = menus.find(m => m.id === selectedMenuId)
  
  const appetizers = dishes.filter(d => d.category === 'APPETIZER')
  const mains = dishes.filter(d => d.category === 'MAIN')
  const desserts = dishes.filter(d => d.category === 'DESSERT')

  const toggleDish = (dishId: string) => {
    setSelectedDishIds(prev =>
      prev.includes(dishId)
        ? prev.filter(id => id !== dishId)
        : [...prev, dishId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedMenuId) {
      alert('Izaberite meni')
      return
    }
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          menuId: selectedMenuId,
          dishIds: selectedDishIds,
        })
      })

      if (res.ok) {
        router.push('/admin/orders')
        router.refresh()
      } else {
        alert('Greška pri kreiranju narudžbine')
      }
    } catch {
      alert('Greška pri kreiranju narudžbine')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Info */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
          <h2 className="text-lg font-semibold text-white">Podaci o Klijentu</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Ime i Prezime *
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Datum Događaja
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Adresa
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Poruka
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Menu Selection */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
          <h2 className="text-lg font-semibold text-white">Izbor Menija</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Meni *
              </label>
              <select
                required
                value={selectedMenuId}
                onChange={(e) => setSelectedMenuId(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Izaberite meni</option>
                {menus.map(menu => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name} ({menu.dishCount} jela)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Broj Porcija
              </label>
              <input
                type="number"
                min={1}
                value={formData.portions}
                onChange={(e) => setFormData(prev => ({ ...prev, portions: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dish Selection */}
      {selectedMenu && (
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
            <h2 className="text-lg font-semibold text-white">
              Izabrana Jela ({selectedDishIds.length}/{selectedMenu.dishCount})
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Appetizers */}
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-3">PREDJELA</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {appetizers.map(dish => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => toggleDish(dish.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      selectedDishIds.includes(dish.id)
                        ? 'bg-amber-500/20 border-amber-500/50 border'
                        : 'bg-neutral-800 border border-transparent hover:bg-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedDishIds.includes(dish.id) && (
                        <Check className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={selectedDishIds.includes(dish.id) ? 'text-white' : 'text-neutral-300'}>
                        {dish.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mains */}
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-3">GLAVNA JELA</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mains.map(dish => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => toggleDish(dish.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      selectedDishIds.includes(dish.id)
                        ? 'bg-amber-500/20 border-amber-500/50 border'
                        : 'bg-neutral-800 border border-transparent hover:bg-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedDishIds.includes(dish.id) && (
                        <Check className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={selectedDishIds.includes(dish.id) ? 'text-white' : 'text-neutral-300'}>
                        {dish.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Desserts */}
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-3">DESERTI</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {desserts.map(dish => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => toggleDish(dish.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      selectedDishIds.includes(dish.id)
                        ? 'bg-amber-500/20 border-amber-500/50 border'
                        : 'bg-neutral-800 border border-transparent hover:bg-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedDishIds.includes(dish.id) && (
                        <Check className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={selectedDishIds.includes(dish.id) ? 'text-white' : 'text-neutral-300'}>
                        {dish.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-lg rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Čuvanje...' : 'Kreiraj Narudžbinu'}
      </button>
    </form>
  )
}
