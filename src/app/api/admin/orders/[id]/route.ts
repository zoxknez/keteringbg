import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Send email notification if status changed
    if (body.status && order.clientEmail) {
      const statusMessages: Record<string, string> = {
        'confirmed': 'Vaša porudžbina je potvrđena! 🎉',
        'completed': 'Vaša porudžbina je završena. Hvala vam! 👋',
        'cancelled': 'Vaša porudžbina je otkazana. ❌'
      }

      const statusSubject: Record<string, string> = {
        'confirmed': '✅ Porudžbina Potvrđena - Ketering Beograd',
        'completed': '👋 Porudžbina Završena - Ketering Beograd',
        'cancelled': '❌ Porudžbina Otkazana - Ketering Beograd'
      }

      if (statusMessages[body.status]) {
        try {
          await resend.emails.send({
            from: 'Ketering Beograd <onboarding@resend.dev>',
            to: [order.clientEmail],
            subject: statusSubject[body.status],
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
                <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Status Porudžbine</h1>
                </div>
                
                <div style="padding: 25px; background-color: #ffffff; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    Poštovani/a <strong>${order.clientName}</strong>,
                  </p>
                  
                  <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin-bottom: 25px; text-align: center;">
                    <p style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0;">
                      ${statusMessages[body.status]}
                    </p>
                  </div>

                  <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 20px; text-align: center;">
                    Hvala vam na poverenju.<br>
                    Ketering Beograd
                  </p>
                </div>
                
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5; border-top: none;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">Ovo je automatska poruka.</p>
                </div>
              </div>
            `
          })
        } catch (error) {
          console.error('Failed to send status email:', error)
        }
      }
    }
    
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
