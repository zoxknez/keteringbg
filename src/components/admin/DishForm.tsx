'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MediaUpload from '@/components/admin/MediaUpload'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface DishFormProps {
  dish?: {
    id: string
    name: string
    description: string | null
    imageUrl: string | null
    videoUrl: string | null
    category: string
    tags: string[]
    isVegetarian: boolean
    isVegan: boolean
    isFasting: boolean
    isAvailable: boolean
  }
}

export default function DishForm({ dish }: DishFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: dish?.name || '',
    description: dish?.description || '',
    imageUrl: dish?.imageUrl || '',
    videoUrl: dish?.videoUrl || '',
    category: dish?.category || 'APPETIZER',
    tags: dish?.tags || [],
    isVegetarian: dish?.isVegetarian || false,
    isVegan: dish?.isVegan || false,
    isFasting: dish?.isFasting || false,
    isAvailable: dish?.isAvailable ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = dish ? `/api/admin/dishes/${dish.id}` : '/api/admin/dishes'
      const method = dish ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/dishes')
        router.refresh()
      } else {
        alert('Greška pri čuvanju')
      }
    } catch {
      alert('Greška pri čuvanju')
    } finally {
      setLoading(false)
    }
  }

  const tagOptions = [
    { value: 'PORK', label: 'Svinjetina' },
    { value: 'CHICKEN', label: 'Piletina' },
    { value: 'BEEF', label: 'Junetina' },
    { value: 'FISH', label: 'Riba' },
    { value: 'VEGETARIAN', label: 'Vegetarijansko' },
    { value: 'VEGAN', label: 'Vegansko' },
    { value: 'FASTING', label: 'Posno' },
  ]

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dishes"
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">
              {dish ? 'Izmeni Jelo' : 'Novo Jelo'}
            </h1>
            <p className="text-neutral-500 mt-1">
              {dish ? 'Ažurirajte detalje jela' : 'Dodajte novo jelo na meni'}
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Osnovne Informacije</h2>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Ime jela *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                placeholder="npr. Piletina u sosu od pečuraka"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Opis
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
                placeholder="Kratak opis jela..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Kategorija *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                <option value="APPETIZER">Predjelo</option>
                <option value="MAIN">Glavno jelo</option>
                <option value="DESSERT">Dezert</option>
              </select>
            </div>
          </div>

          {/* Media */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Mediji</h2>
            
            <MediaUpload
              label="Slika jela"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              type="image"
            />

            <MediaUpload
              label="Video (opciono)"
              value={formData.videoUrl}
              onChange={(url) => setFormData({ ...formData, videoUrl: url })}
              type="video"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Dostupnost</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-5 h-5 rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-neutral-900"
              />
              <span className="text-white">Jelo je dostupno danas</span>
            </label>
          </div>

          {/* Dietary Options */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Dijetetske Oznake</h2>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVegetarian}
                onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                className="w-5 h-5 rounded border-neutral-700 bg-neutral-800 text-green-500 focus:ring-green-500 focus:ring-offset-neutral-900"
              />
              <span className="text-white">Vegetarijansko</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVegan}
                onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                className="w-5 h-5 rounded border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900"
              />
              <span className="text-white">Vegansko</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFasting}
                onChange={(e) => setFormData({ ...formData, isFasting: e.target.checked })}
                className="w-5 h-5 rounded border-neutral-700 bg-neutral-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-neutral-900"
              />
              <span className="text-white">Posno</span>
            </label>
          </div>

          {/* Tags */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Oznake Sastojaka</h2>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => toggleTag(tag.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.tags.includes(tag.value)
                      ? 'bg-amber-500 text-black'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
