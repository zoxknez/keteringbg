import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all orders
export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        menu: true,
        selectedDishes: {
          include: { dish: true }
        }
      }
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST create new order (for manual order creation)
export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    
    const order = await prisma.order.create({
      data: {
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        clientPhone: body.clientPhone,
        address: body.address,
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        message: body.message,
        portions: body.portions || 1,
        menuId: body.menuId,
        selectedDishes: body.dishIds ? {
          create: body.dishIds.map((dishId: string) => ({ dishId }))
        } : undefined
      },
      include: {
        menu: true,
        selectedDishes: { include: { dish: true } }
      }
    })
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
