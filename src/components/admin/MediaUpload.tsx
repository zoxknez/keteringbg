'use client'

import { useState, useRef } from 'react'
import { X, Image as ImageIcon, Video } from 'lucide-react'

interface MediaUploadProps {
  value?: string
  onChange: (url: string) => void
  type?: 'image' | 'video' | 'both'
  label?: string
}

export default function MediaUpload({ value, onChange, type = 'image', label }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const acceptTypes = type === 'video' 
    ? 'video/mp4,video/webm' 
    : type === 'both' 
    ? 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm'
    : 'image/jpeg,image/png,image/webp,image/gif'

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'dishes')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Greška pri upload-u')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const isVideo = value?.includes('.mp4') || value?.includes('.webm')

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-400">{label}</label>
      )}
      
      {value ? (
        <div className="relative rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700">
          {isVideo ? (
            <video 
              src={value} 
              className="w-full h-48 object-cover"
              controls
            />
          ) : (
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-48 object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-amber-500 bg-amber-500/10' 
              : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptTypes}
            onChange={handleChange}
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-neutral-400">Učitavanje...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-neutral-700 flex items-center justify-center">
                {type === 'video' ? (
                  <Video className="w-7 h-7 text-neutral-400" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-neutral-400" />
                )}
              </div>
              <div>
                <p className="text-white font-medium">
                  Prevucite fajl ovde ili kliknite
                </p>
                <p className="text-neutral-500 text-sm mt-1">
                  {type === 'video' ? 'MP4, WebM do 50MB' : 
                   type === 'both' ? 'Slike i video do 50MB' :
                   'JPG, PNG, WebP, GIF do 10MB'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
