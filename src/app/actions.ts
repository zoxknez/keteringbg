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

    // Category translation helper
    const categoryLabels: Record<string, string> = {
      'MAIN': 'Glavno jelo',
      'SALAD': 'Salata',
      'APPETIZER': 'Predjelo',
      'DESSERT': 'Desert',
      'SOUP': 'Supa',
      'SIDE': 'Prilog',
      'DRINK': 'Piće'
    }

    const getCategoryLabel = (cat: string) => categoryLabels[cat] || cat

    const getCategoryColor = (cat: string) => {
      const colors: Record<string, string> = {
        'MAIN': '#d97706',
        'SALAD': '#22c55e',
        'APPETIZER': '#3b82f6',
        'DESSERT': '#ec4899',
        'SOUP': '#f97316',
        'SIDE': '#8b5cf6',
        'DRINK': '#06b6d4'
      }
      return colors[cat] || '#6b7280'
    }

    // Group dishes by category
    const dishesByCategory = order.selectedDishes.reduce((acc, od) => {
      const cat = od.dish.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(od.dish)
      return acc
    }, {} as Record<string, typeof order.selectedDishes[0]['dish'][]>)

    // Send Email
    try {
      await resend.emails.send({
        from: 'Ketering Beograd <onboarding@resend.dev>',
        to: ['zoxknez@hotmail.com'], // Owner email (sandbox mode - must match Resend account)
        replyTo: clientEmail, // Allows direct reply to customer
        subject: `🍽️ Nova Porudžbina: ${clientName} - ${order.menu.name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">🍽️ Nova Porudžbina</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">${new Date().toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div style="padding: 25px; background-color: #ffffff;">
              <h2 style="color: #1f2937; border-bottom: 3px solid #f59e0b; padding-bottom: 10px; margin-top: 0; font-size: 18px;">👤 Podaci o Klijentu</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; width: 130px; vertical-align: top;"><strong>Ime i Prezime:</strong></td>
                  <td style="padding: 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;"><strong>📧 Email:</strong></td>
                  <td style="padding: 10px 0;"><a href="mailto:${clientEmail}" style="color: #d97706; text-decoration: none;">${clientEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;"><strong>📱 Telefon:</strong></td>
                  <td style="padding: 10px 0;"><a href="tel:${clientPhone}" style="color: #d97706; text-decoration: none; font-weight: 500;">${clientPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;"><strong>📍 Adresa:</strong></td>
                  <td style="padding: 10px 0; color: #1f2937;">${address || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;"><strong>📅 Datum:</strong></td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${eventDate ? eventDate.toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                </tr>
              </table>

              <h2 style="color: #1f2937; border-bottom: 3px solid #f59e0b; padding-bottom: 10px;">📋 Detalji Porudžbine</h2>
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <p style="margin: 5px 0; font-size: 20px;"><strong>Meni:</strong> <span style="color: #92400e; font-weight: 700;">${order.menu.name}</span></p>
                <p style="margin: 10px 0 5px 0; font-size: 16px;"><strong>Broj Porcija:</strong> <span style="background-color: #d97706; color: white; padding: 2px 10px; border-radius: 12px; font-weight: 600;">${portions}</span></p>
                ${message ? `<div style="margin-top: 15px; padding: 12px; background-color: rgba(255,255,255,0.7); border-radius: 6px; border-left: 4px solid #d97706;"><strong style="color: #92400e;">💬 Napomena:</strong><br/><span style="color: #1f2937;">${message}</span></div>` : ''}
              </div>

              <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 16px;">🍴 Izabrana Jela (${order.selectedDishes.length}):</h3>
              ${Object.entries(dishesByCategory).map(([category, dishes]) => `
                <div style="margin-bottom: 15px;">
                  <div style="background-color: ${getCategoryColor(category)}; color: white; padding: 8px 12px; border-radius: 6px 6px 0 0; font-weight: 600; font-size: 14px;">
                    ${getCategoryLabel(category)} (${dishes.length})
                  </div>
                  <ul style="list-style-type: none; padding: 0; margin: 0; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 6px 6px;">
                    ${dishes.map((dish, idx) => `
                      <li style="padding: 12px 15px; border-bottom: ${idx < dishes.length - 1 ? '1px solid #e5e7eb' : 'none'}; display: flex; align-items: center;">
                        <span style="font-weight: 500; color: #1f2937;">• ${dish.name}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
            
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">Ova poruka je automatski generisana sa vašeg sajta.</p>
              <p style="color: #6b7280; font-size: 11px; margin: 8px 0 0 0;">Možete direktno odgovoriti na ovaj email da kontaktirate klijenta.</p>
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
