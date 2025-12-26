import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    const posts = await prisma.blogPost.findMany({
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
