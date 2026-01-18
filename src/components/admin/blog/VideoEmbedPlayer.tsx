'use client'

import { useState, useEffect } from 'react'
import { Youtube, Music2, Instagram as InstagramIcon, Film, Facebook as FacebookIcon } from 'lucide-react'

interface VideoEmbedProps {
  platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'VIMEO' | 'FACEBOOK'
  videoId: string
  title?: string
}

const platformConfig = {
  YOUTUBE: {
    icon: Youtube,
    color: 'var(--youtube-red)',
    name: 'YouTube',
  },
  TIKTOK: {
    icon: Music2,
    color: 'var(--tiktok-pink)',
    name: 'TikTok',
  },
  INSTAGRAM: {
    icon: InstagramIcon,
    color: 'var(--instagram-gradient-end)',
    name: 'Instagram',
  },
  VIMEO: {
    icon: Film,
    color: 'var(--vimeo-blue)',
    name: 'Vimeo',
  },
  FACEBOOK: {
    icon: FacebookIcon,
    color: 'var(--facebook-blue)',
    name: 'Facebook',
  },
}

export default function VideoEmbedPlayer({
  platform,
  videoId,
  title,
}: VideoEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const config = platformConfig[platform]
  const Icon = config.icon

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const renderEmbed = () => {
    switch (platform) {
      case 'YOUTUBE':
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video rounded-lg"
            onError={() => setHasError(true)}
          />
        )

      case 'TIKTOK':
        return (
          <blockquote
            className="tiktok-embed"
            cite={`https://www.tiktok.com/@user/video/${videoId}`}
            data-video-id={videoId}
          >
            <section>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.tiktok.com/@user/video/${videoId}`}
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                Pogledaj na TikTok
              </a>
            </section>
          </blockquote>
        )

      case 'INSTAGRAM':
        return (
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={`https://www.instagram.com/p/${videoId}/`}
            data-instgrm-version="14"
          >
            <a
              href={`https://www.instagram.com/p/${videoId}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 transition-colors"
            >
              Pogledaj na Instagram
            </a>
          </blockquote>
        )

      case 'VIMEO':
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            title={title || 'Vimeo video'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video rounded-lg"
            onError={() => setHasError(true)}
          />
        )

      case 'FACEBOOK':
        return (
          <div className="relative overflow-hidden rounded-lg">
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                videoId
              )}&show_text=0`}
              title={title || 'Facebook video'}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              className="w-full aspect-video"
              onError={() => setHasError(true)}
            />
          </div>
        )

      default:
        return (
          <div className="w-full aspect-video glass-card rounded-lg flex items-center justify-center">
            <p className="text-neutral-500">Nepodržana platforma</p>
          </div>
        )
    }
  }

  if (hasError) {
    return (
      <div className="video-embed-container my-6 glass-card rounded-xl p-8 border border-white/10">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Icon className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <p className="text-neutral-400 font-semibold mb-1">Failed to load {config.name} video</p>
            <p className="text-sm text-neutral-600">The video may have been removed or is unavailable</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="video-embed-container my-6 glass-card rounded-xl overflow-hidden border border-white/10 relative">
      {/* Platform Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
        <Icon className="h-4 w-4" style={{ color: config.color }} />
        <span className="text-xs font-bold text-white uppercase tracking-wider">{config.name}</span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-amber-500 animate-spin" />
            <p className="text-sm text-neutral-400">Loading video...</p>
          </div>
        </div>
      )}

      {/* Embed */}
      <div className="relative">
        {renderEmbed()}
      </div>

      {/* Title */}
      {title && (
        <div className="p-4 border-t border-white/5">
          <p className="text-sm text-neutral-400 text-center">{title}</p>
        </div>
      )}
    </div>
  )
}
