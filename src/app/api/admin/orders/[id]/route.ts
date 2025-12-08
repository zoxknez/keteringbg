import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single order
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        menu: true,
        selectedDishes: {
          include: { dish: true }
        }
      }
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// PUT update order (status, etc.)
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
    
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        clientPhone: body.clientPhone,
        address: body.address,
        eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
        message: body.message,
        portions: body.portions,
      }
    })
    
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// DELETE order
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
    // First delete related OrderDish records
    await prisma.orderDish.deleteMany({
      where: { orderId: id }
    })
    
    // Then delete the order
    await prisma.order.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
