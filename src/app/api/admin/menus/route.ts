import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all menus
export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { dishCount: 'asc' },
      include: { dishes: true }
    })
    return NextResponse.json(menus)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 })
  }
}

// POST create new menu
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const menu = await prisma.menu.create({
      data: {
        name: body.name,
        dishCount: body.dishCount,
        price: body.price || null,
      }
    })
    return NextResponse.json(menu)
  } catch {
    return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 })
  }
}
