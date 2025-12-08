'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Film, Search, X } from 'lucide-react'

interface MediaFile {
  name: string
  url: string
  type: 'image' | 'video'
  size?: number
  lastModified?: Date
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [search, setSearch] = useState('')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  const loadFiles = async () => {
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

  useEffect(() => {
    loadFiles()
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    
    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (res.ok) {
          await loadFiles()
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
    
    setUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov']
    }
  })

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const deleteFile = async (fileName: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj fajl?')) return
    
    try {
      const res = await fetch(`/api/admin/media/${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        await loadFiles()
        setSelectedFile(null)
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const filteredFiles = files.filter(file => {
    const matchesFilter = filter === 'all' || file.type === filter
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const imageCount = files.filter(f => f.type === 'image').length
  const videoCount = files.filter(f => f.type === 'video').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Mediji</h1>
          <p className="text-neutral-500 mt-1">Upravljajte slikama i video fajlovima</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <ImageIcon className="w-4 h-4" /> {imageCount} slika
          </span>
          <span className="flex items-center gap-1">
            <Film className="w-4 h-4" /> {videoCount} video
          </span>
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-amber-500 bg-amber-500/10' 
            : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-neutral-400">Otpremanje...</span>
          </div>
        ) : (
          <>
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-amber-500' : 'text-neutral-600'}`} />
            <p className="text-neutral-400 mb-2">
              {isDragActive ? 'Pustite fajlove ovde...' : 'Prevucite fajlove ovde ili kliknite za upload'}
            </p>
            <p className="text-sm text-neutral-600">
              Podržani formati: JPG, PNG, GIF, WebP, MP4, WebM
            </p>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Pretraži fajlove..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'image', 'video'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === f
                  ? 'bg-amber-500 text-black'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {f === 'all' ? 'Sve' : f === 'image' ? 'Slike' : 'Video'}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {search || filter !== 'all' ? 'Nema rezultata pretrage' : 'Nema otpremljenih fajlova'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file)}
              className="group relative aspect-square bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:border-amber-500 transition-colors"
            >
              {file.type === 'video' ? (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                  <Film className="w-8 h-8 text-neutral-500" />
                </div>
              ) : (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Pregledaj</span>
              </div>
              {file.type === 'video' && (
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                  VIDEO
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* File Detail Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFile(null)}>
          <div className="bg-neutral-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Preview */}
            <div className="relative bg-black aspect-video">
              {selectedFile.type === 'video' ? (
                <video
                  src={selectedFile.url}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="w-full h-full object-contain"
                />
              )}
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 truncate">{selectedFile.name}</h3>
              
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={selectedFile.url}
                  readOnly
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 text-sm"
                />
                <button
                  onClick={() => copyUrl(selectedFile.url)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-white transition-colors flex items-center gap-2"
                >
                  {copiedUrl === selectedFile.url ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      Kopirano
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Kopiraj URL
                    </>
                  )}
                </button>
              </div>
              
              <button
                onClick={() => deleteFile(selectedFile.name)}
                className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-500 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Obriši Fajl
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
