'use server'

import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitOrder(prevState: any, formData: FormData) {
  const clientName = formData.get('clientName') as string
  const clientEmail = formData.get('clientEmail') as string
  const clientPhone = formData.get('clientPhone') as string
  const address = formData.get('address') as string
  const eventDateStr = formData.get('eventDate') as string
  const eventDate = eventDateStr ? new Date(eventDateStr) : null
  const message = formData.get('message') as string
  const portions = parseInt(formData.get('portions') as string) || 1
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
        address,
        eventDate,
        message,
        portions,
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
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nova Porudžbina</h1>
            </div>
            
            <div style="padding: 20px; background-color: #ffffff;">
              <h2 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; margin-top: 0;">Podaci o Klijentu</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Ime i Prezime:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-size: 16px;">${clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${clientEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Telefon:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${clientPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Adresa:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${address || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Datum:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${eventDate ? eventDate.toLocaleString('sr-RS') : '-'}</td>
                </tr>
              </table>

              <h2 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Detalji Porudžbine</h2>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 5px 0; font-size: 18px;"><strong>Meni:</strong> <span style="color: #d97706;">${order.menu.name}</span></p>
                <p style="margin: 5px 0; font-size: 16px;"><strong>Broj Porcija:</strong> ${portions}</p>
                ${message ? `<p style="margin: 15px 0 5px 0; font-style: italic; color: #666;"><strong>Napomena:</strong><br/>${message}</p>` : ''}
              </div>

              <h3 style="color: #333; margin-bottom: 10px;">Izabrana Jela:</h3>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                ${order.selectedDishes.map(od => `
                  <li style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                    <span style="font-weight: 500; color: #333;">${od.dish.name}</span>
                    <span style="color: #888; font-size: 14px;">${od.dish.category}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #666; font-size: 12px;">
              <p style="margin: 0;">Ova poruka je automatski generisana sa vašeg sajta.</p>
            </div>
          </div>
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
