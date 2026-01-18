import Link from 'next/link'
import { CalendarDays, Clock, Video, ArrowRight } from 'lucide-react'

interface FeaturedPostProps {
    post: {
        id: string
        title: string
        slug: string
        excerpt: string | null
        coverImage: string | null
        publishedAt: Date | null
        category: string
        content: string
        videoEmbeds: any[]
    }
    locale: string
    categoryLabel: string
    translations: {
        featured: string
        readMore: string
        readingTime: string
    }
}

export default function FeaturedPost({ post, locale, categoryLabel, translations }: FeaturedPostProps) {
    return (
        <Link
            href={`/${locale}/blog/${post.slug}`}
            className="group relative block w-full min-h-[500px] rounded-3xl overflow-hidden glass-card-hover border border-white/10"
        >
            {/* Background Image */}
            {post.coverImage ? (
                <div className="absolute inset-0 z-0">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
                </div>
            ) : (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-500/20 via-black to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.2),transparent)]" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                {/* Featured Badge */}
                <div className="mb-6 flex items-center gap-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-full">
                        <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                        {translations.featured}
                    </span>
                    <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 text-xs font-bold uppercase tracking-wider rounded-full">
                        {categoryLabel}
                    </span>
                    {post.videoEmbeds.length > 0 && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 text-xs font-bold uppercase tracking-wider rounded-full">
                            <Video className="h-3 w-3" />
                            {post.videoEmbeds.length}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-4 group-hover:text-amber-500 transition-colors">
                    {post.title}
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-6 max-w-3xl line-clamp-3">
                        {post.excerpt}
                    </p>
                )}

                {/* Meta & CTA */}
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-amber-500" />
                            {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString('sr-RS', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })
                                : 'N/A'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            {Math.ceil(post.content.split(' ').length / 200)} {translations.readingTime}
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 text-amber-500 font-semibold text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                        {translations.readMore}
                        <ArrowRight className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-500/30 to-amber-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl" />
        </Link>
    )
}
