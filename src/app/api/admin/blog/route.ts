import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - List all blog posts (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isPublished = searchParams.get('published')
    const limit = searchParams.get('limit')

    const posts = await prisma.blogPost.findMany({
      where: {
        ...(category && { category: category as any }),
        ...(isPublished !== null && { isPublished: isPublished === 'true' }),
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        videoEmbeds: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(limit && { take: parseInt(limit) }),
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get admin user
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      isPublished,
      category,
      tags,
      metaTitle,
      metaDescription,
      videoEmbeds,
    } = body

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        category,
        tags,
        metaTitle,
        metaDescription,
        authorId: admin.id,
        videoEmbeds: {
          create: videoEmbeds?.map((video: any, index: number) => ({
            platform: video.platform,
            videoId: video.videoId,
            title: video.title,
            position: index,
          })) || [],
        },
      },
      include: {
        videoEmbeds: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
