'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, Phone, MapPin, Clock, Mail, Instagram, Facebook, Check } from 'lucide-react'

interface SiteSettings {
  id?: string
  siteName: string
  contactPhone: string
  contactEmail: string
  address: string
  workingHours: string
  instagramUrl: string
  facebookUrl: string
  googleMapsUrl: string
  footerText: string
}

const defaultSettings: SiteSettings = {
  siteName: 'Ketering BGD',
  contactPhone: '+381 11 123 4567',
  contactEmail: 'info@keteringbeo.rs',
  address: 'Beograd, Srbija',
  workingHours: 'Pon-Pet: 08:00-20:00, Sub: 09:00-18:00',
  instagramUrl: '',
  facebookUrl: '',
  googleMapsUrl: '',
  footerText: '© 2025 Ketering BGD. Sva prava zadržana.',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setSettings({ ...defaultSettings, ...data })
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Greška pri čuvanju podešavanja')
      }
    } catch {
      alert('Greška pri čuvanju podešavanja')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">Podešavanja</h1>
        <p className="text-neutral-500 mt-1 text-sm md:text-base">Upravljajte osnovnim podešavanjima sajta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Basic Info */}
        <div className="bg-neutral-900 rounded-xl md:rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-neutral-800 bg-neutral-800/50">
            <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
              Osnovne Informacije
            </h2>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Naziv Sajta
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateField('siteName', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Tekst Futera
              </label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => updateField('footerText', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-500" />
              Kontakt Informacije
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefon
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Adresa
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Radno Vreme
              </label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) => updateField('workingHours', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="npr. Pon-Pet: 08:00-20:00"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Instagram className="w-5 h-5 text-amber-500" />
              Društvene Mreže
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                <Instagram className="w-4 h-4 inline mr-1" />
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => updateField('instagramUrl', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                <Facebook className="w-4 h-4 inline mr-1" />
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => updateField('facebookUrl', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Google Maps URL
              </label>
              <input
                type="url"
                value={settings.googleMapsUrl}
                onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-black'
          } disabled:opacity-50`}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              Sačuvano!
            </>
          ) : saving ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Čuvanje...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Sačuvaj Podešavanja
            </>
          )}
        </button>
      </form>
    </div>
  )
}
