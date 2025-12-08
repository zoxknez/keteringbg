import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all dishes
export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      include: { menus: true },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(dishes)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dishes' }, { status: 500 })
  }
}

// POST create new dish
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const dish = await prisma.dish.create({
      data: {
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl,
        category: body.category,
        tags: body.tags || [],
        isVegetarian: body.isVegetarian || false,
        isVegan: body.isVegan || false,
        isFasting: body.isFasting || false,
        isAvailable: body.isAvailable ?? true,
      }
    })
    return NextResponse.json(dish)
  } catch {
    return NextResponse.json({ error: 'Failed to create dish' }, { status: 500 })
  }
}
