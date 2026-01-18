import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CalendarDays, Clock, Tag, User, ArrowLeft, Video } from 'lucide-react'
import VideoEmbedPlayer from '@/components/admin/blog/VideoEmbedPlayer'
import SocialShare from '@/components/blog/SocialShare'
import RelatedPosts from '@/components/blog/RelatedPosts'
import BlogNavbar from '@/components/blog/BlogNavbar'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

async function getBlogPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      videoEmbeds: {
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  return post
}

async function getRelatedPosts(category: string, currentSlug: string, limit = 3) {
  return await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      category: category as any,
      slug: { not: currentSlug },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      content: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  })
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug)

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.title,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.title,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.title,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

const categoryLabels: Record<string, { sr: string; en: string; ru: string }> = {
  NEWS: { sr: 'Vesti', en: 'News', ru: 'Новости' },
  RECIPES: { sr: 'Recepti', en: 'Recipes', ru: 'Рецепты' },
  EVENTS: { sr: 'Događaji', en: 'Events', ru: 'События' },
  TIPS: { sr: 'Saveti', en: 'Tips', ru: 'Советы' },
  BEHIND_SCENES: { sr: 'Iza kulisa', en: 'Behind the Scenes', ru: 'За кулисами' },
}

export default async function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}) {
  const post = await getBlogPost(slug)
  const relatedPosts = await getRelatedPosts(post.category, post.slug)
  const t = await getTranslations('Blog')

  // Construct full URL for social sharing
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const fullUrl = `${baseUrl}/${locale}/blog/${post.slug}`

  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <BlogNavbar />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-end relative px-6 pb-16 pt-32">
        {post.coverImage ? (
          <>
            <div className="absolute inset-0 z-0">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
            </div>
            <div className="max-w-5xl mx-auto relative z-10 space-y-6 animate-fade-in-up">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('backToBlog')}
              </Link>
              <div className="space-y-4">
                <span className="inline-block px-4 py-2 bg-amber-500 text-black text-sm font-bold uppercase tracking-wider rounded-full">
                  {categoryLabels[post.category]?.[locale as keyof typeof categoryLabels.NEWS] || categoryLabels[post.category]?.sr}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="text-xl text-neutral-300 leading-relaxed max-w-3xl">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-5xl mx-auto w-full space-y-6 animate-fade-in-up">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToBlog')}
            </Link>
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-amber-500 text-black text-sm font-bold uppercase tracking-wider rounded-full">
                {categoryLabels[post.category]?.[locale as keyof typeof categoryLabels.NEWS] || categoryLabels[post.category]?.sr}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-neutral-400 leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Article Meta */}
      <section className="py-6 px-6 relative z-10 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-amber-500" />
              <span className="text-neutral-400">{post.author.name || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-amber-500" />
              <span className="text-neutral-400">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('sr-RS', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-neutral-400">{Math.ceil(post.content.split(' ').length / 200)} {t('readingTime')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <article className="glass-card rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10">
            {/* Main Content */}
            <div className="prose prose-lg prose-invert max-w-none mb-8">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph && (
                  <p key={index} className="mb-6 text-neutral-300 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Video Embeds */}
            {post.videoEmbeds.length > 0 && (
              <div className="border-t border-white/10 pt-8 mt-8">
                <h2 className="text-3xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                  <Video className="h-8 w-8 text-amber-500" />
                  {t('videoContent')}
                </h2>
                <div className="space-y-8">
                  {post.videoEmbeds.map((video) => (
                    <VideoEmbedPlayer
                      key={video.id}
                      platform={video.platform}
                      videoId={video.videoId}
                      title={video.title || undefined}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="border-t border-white/10 pt-8 mt-8">
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-neutral-400 rounded-full text-sm hover:bg-white/10 hover:border-amber-500/50 transition-all"
                    >
                      <Tag className="h-3.5 w-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share */}
            <div className="border-t border-white/10 pt-8 mt-8">
              <SocialShare
                url={fullUrl}
                title={post.title}
                description={post.excerpt || undefined}
              />
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <RelatedPosts
              posts={relatedPosts}
              locale={locale}
              categoryLabel={categoryLabels[post.category]?.[locale as keyof typeof categoryLabels.NEWS] || categoryLabels[post.category]?.sr}
              translations={{
                moreFrom: t('moreFrom') || 'More from',
                readingTime: t('readingTime') || 'min read',
              }}
            />
          )}

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-black rounded-full font-semibold text-sm uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-amber-500/20"
            >
              <ArrowLeft className="h-5 w-5" />
              {t('backToBlog')}
            </Link>
          </div>
        </div>
      </section>

      {/* Load external scripts for embeds */}
      <script async src="https://www.tiktok.com/embed.js" />
      <script async src="https://www.instagram.com/embed.js" />
    </div>
  )
}
