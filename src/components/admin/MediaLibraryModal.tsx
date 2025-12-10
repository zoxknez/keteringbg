'use client'

import { useState, useEffect } from 'react'
import { X, Image as ImageIcon, Video, Search, Check } from 'lucide-react'

interface MediaFile {
  name: string
  url: string
  type: 'image' | 'video'
}

interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
  type?: 'image' | 'video' | 'both'
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect, type = 'image' }: MediaLibraryModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadFiles()
    }
  }, [isOpen])

  const loadFiles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        setFiles(data.files || [])
      }
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFiles = files.filter(file => {
    const matchesType = type === 'both' || file.type === type
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 w-full max-w-4xl rounded-2xl border border-neutral-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Biblioteka Medija</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Pretraži fajlove..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center text-neutral-500 py-10">
              Nema pronađenih fajlova
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <button
                  key={file.url}
                  onClick={() => setSelectedUrl(file.url)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedUrl === file.url
                      ? 'border-amber-500'
                      : 'border-transparent hover:border-neutral-600'
                  }`}
                >
                  {file.type === 'video' ? (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                      <Video className="w-8 h-8 text-neutral-500" />
                    </div>
                  ) : (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    selectedUrl === file.url ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {selectedUrl === file.url && (
                      <div className="bg-amber-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-xs text-white truncate">
                    {file.name.split('/').pop()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            Otkaži
          </button>
          <button
            onClick={() => {
              if (selectedUrl) {
                onSelect(selectedUrl)
                onClose()
              }
            }}
            disabled={!selectedUrl}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors"
          >
            Izaberi
          </button>
        </div>
      </div>
    </div>
  )
}
