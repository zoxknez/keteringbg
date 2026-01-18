'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock, Tag, Video } from 'lucide-react'
import BlogSearch from '@/components/blog/BlogSearch'
import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    publishedAt: Date | null
    category: string
    content: string
    tags: string[]
    videoEmbeds: any[]
    author: {
        name: string | null
    }
}

interface BlogPostsClientProps {
    posts: BlogPost[]
    locale: string
    categoryLabels: Record<string, { sr: string; en: string; ru: string }>
    translations: {
        noPosts: string
        readingTime: string
        searchPlaceholder: string
        noResults: string
    }
}

export default function BlogPostsClient({ posts, locale, categoryLabels, translations }: BlogPostsClientProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredPosts = posts.filter((post) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            post.title.toLowerCase().includes(query) ||
            post.excerpt?.toLowerCase().includes(query) ||
            post.tags.some((tag) => tag.toLowerCase().includes(query))
        )
    })

    return (
        <>
            {/* Search Bar */}
            {posts.length > 0 && (
                <section className="py-8 px-6 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <BlogSearch onSearch={setSearchQuery} placeholder={translations.searchPlaceholder} />
                    </div>
                </section>
            )}

            {/* Blog Posts Grid */}
            <section className="py-16 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {posts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
                                <Video className="h-10 w-10 text-neutral-600" />
                            </div>
                            <p className="text-neutral-500 text-lg">{translations.noPosts}</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-neutral-500 text-lg">{translations.noResults}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post, index) => (
                                <Link
                                    key={post.id}
                                    href={`/${locale}/blog/${post.slug}`}
                                    className="group relative glass-card-hover rounded-2xl overflow-hidden border border-white/10 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Cover Image */}
                                    {post.coverImage ? (
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            {post.videoEmbeds.length > 0 && (
                                                <div className="absolute top-4 right-4 flex items-center gap-2 bg-amber-500 text-black px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    <Video className="h-3 w-3" />
                                                    {post.videoEmbeds.length}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-56 bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center relative overflow-hidden">
                                            <Video className="h-16 w-16 text-amber-500/30" />
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.1),transparent)]" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        {/* Category Badge */}
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold uppercase tracking-wider rounded-full">
                                                {categoryLabels[post.category]?.[locale as keyof typeof categoryLabels.NEWS] ||
                                                    categoryLabels[post.category]?.sr}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-xl font-serif font-bold text-white group-hover:text-amber-500 transition-colors leading-tight">
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Tags */}
                                        {post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center gap-1 text-xs text-neutral-500"
                                                    >
                                                        <Tag className="h-3 w-3" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-xs text-neutral-600 pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {post.publishedAt
                                                    ? new Date(post.publishedAt).toLocaleDateString('sr-RS', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })
                                                    : 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                {Math.ceil(post.content.split(' ').length / 200)} {translations.readingTime}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
