import Link from 'next/link'
import { CalendarDays, Clock, ArrowRight } from 'lucide-react'

interface RelatedPost {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    publishedAt: Date | null
    content: string
}

interface RelatedPostsProps {
    posts: RelatedPost[]
    locale: string
    categoryLabel: string
    translations: {
        moreFrom: string
        readingTime: string
    }
}

export default function RelatedPosts({ posts, locale, categoryLabel, translations }: RelatedPostsProps) {
    if (posts.length === 0) return null

    return (
        <section className="py-16 border-t border-white/10">
            <h2 className="text-3xl font-serif font-bold text-white mb-8">
                {translations.moreFrom} {categoryLabel}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/${locale}/blog/${post.slug}`}
                        className="group glass-card-hover rounded-xl overflow-hidden border border-white/10"
                    >
                        {/* Cover Image */}
                        {post.coverImage ? (
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        ) : (
                            <div className="h-40 bg-gradient-to-br from-amber-500/10 to-amber-500/5" />
                        )}

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-500 transition-colors line-clamp-2 leading-tight">
                                {post.title}
                            </h3>

                            {post.excerpt && (
                                <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-neutral-600 pt-2 border-t border-white/5">
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays className="h-3 w-3" />
                                    {post.publishedAt
                                        ? new Date(post.publishedAt).toLocaleDateString('sr-RS', {
                                            day: 'numeric',
                                            month: 'short',
                                        })
                                        : 'N/A'}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" />
                                    {Math.ceil(post.content.split(' ').length / 200)} {translations.readingTime}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                                Read More
                                <ArrowRight className="h-3 w-3" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
