'use client'

interface VideoEmbedProps {
  platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'VIMEO' | 'FACEBOOK'
  videoId: string
  title?: string
}

export default function VideoEmbedPlayer({
  platform,
  videoId,
  title,
}: VideoEmbedProps) {
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
            />
          </div>
        )

      default:
        return (
          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Nepodržana platforma</p>
          </div>
        )
    }
  }

  return (
    <div className="video-embed-container my-6">
      {renderEmbed()}
      {title && (
        <p className="text-sm text-gray-600 mt-2 text-center">{title}</p>
      )}
    </div>
  )
}
