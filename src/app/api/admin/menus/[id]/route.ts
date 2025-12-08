import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single menu
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: { dishes: true }
    })
    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 })
    }
    return NextResponse.json(menu)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

// PUT update menu
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
    
    // If updating dishes
    if (body.dishIds !== undefined) {
      const menu = await prisma.menu.update({
        where: { id },
        data: {
          dishes: {
            set: body.dishIds.map((dishId: string) => ({ id: dishId }))
          }
        },
        include: { dishes: true }
      })
      return NextResponse.json(menu)
    }
    
    // Regular update
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        name: body.name,
        dishCount: body.dishCount,
        price: body.price,
      }
    })
    return NextResponse.json(menu)
  } catch {
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 })
  }
}

// DELETE menu
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
    await prisma.menu.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 })
  }
}
