'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Youtube, Instagram, Video, Facebook } from 'lucide-react'
import MediaLibraryModal from '../MediaLibraryModal'

interface VideoEmbed {
  id?: string
  platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'VIMEO' | 'FACEBOOK'
  videoId: string
  title?: string
  position: number
}

interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt?: string
  content: string
  coverImage?: string
  isPublished: boolean
  publishedAt?: Date | null
  category: string
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  videoEmbeds?: VideoEmbed[]
}

interface BlogFormProps {
  post?: BlogPost
  mode: 'create' | 'edit'
}

const categoryOptions = [
  { value: 'NEWS', label: 'Vesti' },
  { value: 'RECIPES', label: 'Recepti' },
  { value: 'EVENTS', label: 'Događaji' },
  { value: 'TIPS', label: 'Saveti' },
  { value: 'BEHIND_SCENES', label: 'Iza kulisa' },
]

const platformIcons = {
  YOUTUBE: Youtube,
  TIKTOK: Video,
  INSTAGRAM: Instagram,
  VIMEO: Video,
  FACEBOOK: Facebook,
}

export default function BlogForm({ post, mode }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [formData, setFormData] = useState<BlogPost>({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    isPublished: post?.isPublished || false,
    category: post?.category || 'NEWS',
    tags: post?.tags || [],
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    videoEmbeds: post?.videoEmbeds || [],
  })
  const [newTag, setNewTag] = useState('')
  const [newVideo, setNewVideo] = useState({
    platform: 'YOUTUBE' as VideoEmbed['platform'],
    videoId: '',
    title: '',
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === 'create' && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === 'create' ? '/api/admin/blog' : `/api/admin/blog/${post?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Greška pri čuvanju')
      }

      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Greška pri čuvanju')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj post?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/blog/${post?.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Greška pri brisanju')

      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      alert('Greška pri brisanju')
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const addVideoEmbed = () => {
    if (newVideo.videoId) {
      const video: VideoEmbed = {
        ...newVideo,
        position: formData.videoEmbeds?.length || 0,
      }
      setFormData((prev) => ({
        ...prev,
        videoEmbeds: [...(prev.videoEmbeds || []), video],
      }))
      setNewVideo({ platform: 'YOUTUBE', videoId: '', title: '' })
    }
  }

  const removeVideoEmbed = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      videoEmbeds: prev.videoEmbeds?.filter((_, i) => i !== index),
    }))
  }

  const extractVideoId = (url: string, platform: VideoEmbed['platform']): string => {
    try {
      if (platform === 'YOUTUBE') {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
        return match ? match[1] : url
      } else if (platform === 'TIKTOK') {
        const match = url.match(/tiktok\.com\/.*\/video\/(\d+)/)
        return match ? match[1] : url
      } else if (platform === 'INSTAGRAM') {
        const match = url.match(/instagram\.com\/(?:p|reel)\/([^\/\s]+)/)
        return match ? match[1] : url
      } else if (platform === 'VIMEO') {
        const match = url.match(/vimeo\.com\/(\d+)/)
        return match ? match[1] : url
      } else if (platform === 'FACEBOOK') {
        return url
      }
      return url
    } catch {
      return url
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold">Osnovne informacije</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naslov *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Unesite naslov blog posta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="url-friendly-slug"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL adresa: /blog/{formData.slug || 'slug'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategorija *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kratak opis
            </label>
            <textarea
              value={formData.excerpt || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Kratak opis koji će se prikazati u pregledu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sadržaj *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              placeholder="Sadržaj blog posta..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Podržano: markdown format
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naslovna slika
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.coverImage || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: e.target.value,
                  }))
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="URL slike ili kliknite za odabir..."
              />
              <button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Odaberi
              </button>
            </div>
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Preview"
                className="mt-2 h-32 w-auto rounded-lg object-cover"
              />
            )}
          </div>
        </div>

        {/* Video Embeds Section */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold">Video Klipovi</h2>
          <p className="text-sm text-gray-600">
            Dodajte video klipove sa YouTube, TikTok, Instagram, Vimeo ili Facebook
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platforma
                </label>
                <select
                  value={newVideo.platform}
                  onChange={(e) =>
                    setNewVideo((prev) => ({
                      ...prev,
                      platform: e.target.value as VideoEmbed['platform'],
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="YOUTUBE">YouTube</option>
                  <option value="TIKTOK">TikTok</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="VIMEO">Vimeo</option>
                  <option value="FACEBOOK">Facebook</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL ili ID videa
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVideo.videoId}
                    onChange={(e) => {
                      const extracted = extractVideoId(e.target.value, newVideo.platform)
                      setNewVideo((prev) => ({ ...prev, videoId: extracted }))
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Zalepite URL ili unesite ID"
                  />
                  <button
                    type="button"
                    onClick={addVideoEmbed}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {formData.videoEmbeds && formData.videoEmbeds.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Dodati video klipovi ({formData.videoEmbeds.length})
                </h3>
                <div className="space-y-2">
                  {formData.videoEmbeds.map((video, index) => {
                    const Icon = platformIcons[video.platform]
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                      >
                        <Icon className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{video.platform}</p>
                          <p className="text-xs text-gray-500">{video.videoId}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVideoEmbed(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold">Tagovi</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Dodaj tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Dodaj
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold">SEO</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta naslov
            </label>
            <input
              type="text"
              value={formData.metaTitle || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ostavi prazno za auto-generisanje"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta opis
            </label>
            <textarea
              value={formData.metaDescription || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  metaDescription: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Kratak opis za pretraživače"
            />
          </div>
        </div>

        {/* Publishing */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold">Objavljivanje</h2>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPublished: e.target.checked,
                  publishedAt: e.target.checked ? new Date() : null,
                }))
              }
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
              Objavi odmah
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div>
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
              >
                Obriši Post
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
            >
              {loading ? 'Čuvanje...' : mode === 'create' ? 'Kreiraj Post' : 'Sačuvaj Izmene'}
            </button>
          </div>
        </div>
      </form>

      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, coverImage: url }))
          setShowMediaLibrary(false)
        }}
        onClose={() => setShowMediaLibrary(false)}
      />
    </>
  )
}
