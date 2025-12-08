import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single dish
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const dish = await prisma.dish.findUnique({
      where: { id },
      include: { menus: true }
    })
    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
    }
    return NextResponse.json(dish)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dish' }, { status: 404 })
  }
}

// PUT update dish
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  try {
    const body = await req.json()
    const dish = await prisma.dish.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl,
        category: body.category,
        tags: body.tags,
        isVegetarian: body.isVegetarian,
        isVegan: body.isVegan,
        isFasting: body.isFasting,
        isAvailable: body.isAvailable,
      }
    })
    return NextResponse.json(dish)
  } catch {
    return NextResponse.json({ error: 'Failed to update dish' }, { status: 500 })
  }
}

// DELETE dish
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  try {
    await prisma.dish.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete dish' }, { status: 500 })
  }
}
