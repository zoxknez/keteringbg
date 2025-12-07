'use server'

import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitOrder(prevState: any, formData: FormData) {
  const clientName = formData.get('clientName') as string
  const clientEmail = formData.get('clientEmail') as string
  const clientPhone = formData.get('clientPhone') as string
  const message = formData.get('message') as string
  const menuId = formData.get('menuId') as string
  const selectedDishIds = JSON.parse(formData.get('selectedDishIds') as string) as string[]

  if (!clientName || !clientEmail || !menuId || selectedDishIds.length === 0) {
    return { success: false, message: 'Molimo popunite sva polja i izaberite jela.' }
  }

  try {
    // Save to DB
    const order = await prisma.order.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        message,
        menuId,
        selectedDishes: {
          create: selectedDishIds.map(dishId => ({
            dish: { connect: { id: dishId } }
          }))
        }
      },
      include: {
        menu: true,
        selectedDishes: {
          include: {
            dish: true
          }
        }
      }
    })

    // Send Email (Simulated if key is invalid)
    try {
      await resend.emails.send({
        from: 'Ketering Beograd <onboarding@resend.dev>',
        to: ['spalevic.dragan@gmail.com'], // Owner email
        subject: `Nova Porudžbina: ${clientName} - ${order.menu.name}`,
        html: `
          <h1>Nova Porudžbina</h1>
          <p><strong>Klijent:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Telefon:</strong> ${clientPhone}</p>
          <p><strong>Poruka:</strong> ${message}</p>
          <hr />
          <h2>Meni: ${order.menu.name}</h2>
          <h3>Izabrana Jela:</h3>
          <ul>
            ${order.selectedDishes.map(od => `<li>${od.dish.name} (${od.dish.category})</li>`).join('')}
          </ul>
        `
      })
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
      // Don't fail the request if email fails, just log it
    }

    return { success: true, message: 'Vaša porudžbina je uspešno poslata!' }
  } catch (error) {
    console.error('Order submission error:', error)
    return { success: false, message: 'Došlo je do greške prilikom slanja porudžbine.' }
  }
}
