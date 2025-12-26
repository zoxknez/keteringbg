import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CalendarDays, Clock, Tag, Video } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

async function getBlogPosts(category?: string) {
  return await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      ...(category && { category: category as any }),
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      videoEmbeds: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })
}

const categoryLabels: Record<string, { sr: string; en: string; ru: string }> = {
  NEWS: { sr: 'Vesti', en: 'News', ru: 'Новости' },
  RECIPES: { sr: 'Recepti', en: 'Recipes', ru: 'Рецепты' },
  EVENTS: { sr: 'Događaji', en: 'Events', ru: 'События' },
  TIPS: { sr: 'Saveti', en: 'Tips', ru: 'Советы' },
  BEHIND_SCENES: { sr: 'Iza kulisa', en: 'Behind the Scenes', ru: 'За кулисами' },
}

export default async function BlogPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { category?: string }
}) {
  const posts = await getBlogPosts(searchParams.category)
  const t = await getTranslations('Blog')

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center relative px-6 pt-32 pb-24">
        <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in-up">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400">
              {t('title')}
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-[0.9]">
              {t('title')}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-neutral-600">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-amber-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href={`/${locale}/blog`}
              className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                !searchParams.category
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10 hover:border-amber-500/50'
              }`}
            >
              {t('allCategories')}
            </Link>
            {Object.entries(categoryLabels).map(([key, labels]) => (
              <Link
                key={key}
                href={`/${locale}/blog?category=${key}`}
                className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                  searchParams.category === key
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10 hover:border-amber-500/50'
                }`}
              >
                {labels[locale as keyof typeof labels] || labels.sr}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
                <Video className="h-10 w-10 text-neutral-600" />
              </div>
              <p className="text-neutral-500 text-lg">
                {t('noPosts')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10"
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
                        {Math.ceil(post.content.split(' ').length / 200)} {t('readingTime')}
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
    </div>
  )
}
