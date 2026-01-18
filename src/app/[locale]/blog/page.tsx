import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import FeaturedPost from '@/components/blog/FeaturedPost'
import BlogPostsClient from '@/components/blog/BlogPostsClient'
import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton'
import BlogNavbar from '@/components/blog/BlogNavbar'

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
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const params = await paramsPromise
  const searchParams = await searchParamsPromise
  const { locale } = params
  const posts = await getBlogPosts(searchParams.category)
  const t = await getTranslations('Blog')

  // Get featured post (most recent)
  const featuredPost = !searchParams.category && posts.length > 0 ? posts[0] : null
  const regularPosts = featuredPost ? posts.slice(1) : posts

  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <BlogNavbar />

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

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-8 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <FeaturedPost
              post={featuredPost}
              locale={locale}
              categoryLabel={categoryLabels[featuredPost.category]?.[locale as keyof typeof categoryLabels.NEWS] || categoryLabels[featuredPost.category]?.sr}
              translations={{
                featured: t('featured') || 'Featured',
                readMore: t('readMore') || 'Read More',
                readingTime: t('readingTime') || 'min read',
              }}
            />
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href={`/${locale}/blog`}
              className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${!searchParams.category
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
                className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${searchParams.category === key
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

      {/* Blog Posts with Search */}
      <BlogPostsClient
        posts={regularPosts}
        locale={locale}
        categoryLabels={categoryLabels}
        translations={{
          noPosts: t('noPosts') || 'No published posts yet',
          readingTime: t('readingTime') || 'min read',
          searchPlaceholder: t('searchPlaceholder') || 'Search posts...',
          noResults: t('noResults') || 'No posts found matching your search',
        }}
      />
    </div>
  )
}
