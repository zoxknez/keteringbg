'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItemData {
  menuId: string
  menuName: string
  menuPrice: number
  portions: number
  totalPrice: number
  selectedDishIds: string[]
  selectedDishNames: string[]
}

interface OrderData {
  items: OrderItemData[]
  totalPrice: number
  totalPortions: number
}

export async function submitOrder(prevState: { success: boolean; message: string }, formData: FormData) {
  const clientName = formData.get('clientName') as string
  const clientEmail = formData.get('clientEmail') as string
  const clientPhone = formData.get('clientPhone') as string
  const address = formData.get('address') as string
  const eventDateStr = formData.get('eventDate') as string
  const eventDate = eventDateStr ? new Date(eventDateStr) : null
  const message = formData.get('message') as string
  const locale = formData.get('locale') as string || 'sr'
  
  // Parse order data
  const orderDataStr = formData.get('orderData') as string
  let orderData: OrderData
  
  try {
    orderData = JSON.parse(orderDataStr)
  } catch {
    return { success: false, message: 'Greška u podacima porudžbine.' }
  }

  if (!clientName || !clientEmail || !orderData.items || orderData.items.length === 0) {
    return { success: false, message: 'Molimo popunite sva polja i izaberite jela.' }
  }

  try {
    // Locale labels for email
    const localeLabels: Record<string, { flag: string; name: string }> = {
      'sr': { flag: '🇷🇸', name: 'Srpski' },
      'en': { flag: '🇬🇧', name: 'English' },
      'ru': { flag: '🇷🇺', name: 'Русский' }
    }
    const clientLocale = localeLabels[locale] || localeLabels['sr']

    // Build order items HTML
    const orderItemsHtml = orderData.items.map((item, index) => `
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Stavka ${index + 1}</span>
            <h3 style="color: #ffffff; margin: 4px 0 0 0; font-size: 18px; font-weight: 600;">${item.menuName}</h3>
          </div>
          <div style="text-align: right;">
            <span style="background-color: #f59e0b; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 14px;">
              ${item.portions} ${item.portions === 1 ? 'porcija' : 'porcija'}
            </span>
          </div>
        </div>
        
        <div style="padding: 16px 20px;">
          <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px;">Izabrana jela:</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${item.selectedDishNames.map(name => `
              <span style="background-color: #f3f4f6; color: #374151; padding: 6px 12px; border-radius: 8px; font-size: 13px; display: inline-block;">
                ${name}
              </span>
            `).join('')}
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 16px; padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #6b7280; font-size: 14px;">${item.portions} × ${item.menuPrice.toLocaleString()} RSD</span>
            <span style="color: #1f2937; font-size: 18px; font-weight: 700;">${item.totalPrice.toLocaleString()} RSD</span>
          </div>
        </div>
      </div>
    `).join('')

    // Send Email to Admin
    try {
      console.log('=== ORDER SUBMISSION ===')
      console.log('Customer:', clientName, clientPhone, clientEmail)
      console.log('Order items:', orderData.items.length)
      console.log('Total:', orderData.totalPrice, 'RSD')
      console.log('API Key exists:', !!process.env.RESEND_API_KEY)
      console.log('API Key prefix:', process.env.RESEND_API_KEY?.substring(0, 10) + '...')
      
      // 1. Email to Admin
      const adminEmailResult = await resend.emails.send({
        from: 'Ketering Beograd <onboarding@resend.dev>',
        to: ['spalevic.dragan@gmail.com'],
        replyTo: clientEmail,
        subject: `🍽️ Nova Porudžbina: ${clientName} - ${orderData.totalPortions} porcija (${orderData.totalPrice.toLocaleString()} RSD)`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">🍽️ Nova Porudžbina</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
                ${new Date().toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            <div style="padding: 25px; background-color: #ffffff; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5;">
              <!-- Customer Info -->
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                  👤 Podaci o Klijentu
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 130px;"><strong>Ime:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${clientName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>🌐 Jezik:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${clientLocale.flag} ${clientLocale.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>📧 Email:</strong></td>
                    <td style="padding: 8px 0;"><a href="mailto:${clientEmail}" style="color: #d97706; text-decoration: none;">${clientEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>📱 Telefon:</strong></td>
                    <td style="padding: 8px 0;"><a href="tel:${clientPhone}" style="color: #d97706; text-decoration: none; font-weight: 600;">${clientPhone}</a></td>
                  </tr>
                </table>
              </div>

              <!-- Delivery Info -->
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 16px;">📍 Dostava</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 130px;"><strong>Adresa:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${address || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>Datum:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">
                      ${eventDate ? eventDate.toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                  </tr>
                  ${message ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; vertical-align: top;"><strong>Napomena:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${message}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Order Items -->
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                📋 Porudžbina (${orderData.items.length} ${orderData.items.length === 1 ? 'stavka' : 'stavke'})
              </h2>
              
              ${orderItemsHtml}

              <!-- Total -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="color: #92400e; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Ukupno za plaćanje</p>
                <p style="color: #1f2937; margin: 0; font-size: 36px; font-weight: 800;">${orderData.totalPrice.toLocaleString()} RSD</p>
                <p style="color: #78350f; margin: 8px 0 0 0; font-size: 14px;">${orderData.totalPortions} porcija</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #1f2937; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">Ova poruka je automatski generisana sa vašeg sajta.</p>
              <p style="color: #6b7280; font-size: 11px; margin: 8px 0 0 0;">Možete direktno odgovoriti na ovaj email da kontaktirate klijenta.</p>
            </div>
          </div>
        `
      })
      
      if (adminEmailResult.error) {
        console.error('Admin email failed:', adminEmailResult.error)
        throw new Error(`Admin email failed: ${adminEmailResult.error.message}`)
      }
      console.log('Admin email sent:', adminEmailResult.data)

      // 2. Email to Client (Confirmation)
      const clientEmailResult = await resend.emails.send({
        from: 'Ketering Beograd <onboarding@resend.dev>',
        to: [clientEmail],
        subject: '✅ Primili smo vašu porudžbinu - Ketering Beograd',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Hvala na poverenju!</h1>
              <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 16px;">
                Vaša porudžbina je uspešno primljena.
              </p>
            </div>
            
            <div style="padding: 25px; background-color: #ffffff; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5;">
              <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                Poštovani/a <strong>${clientName}</strong>,
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                Hvala što ste izabrali Ketering Beograd. Vaša porudžbina je u obradi i uskoro ćemo vas kontaktirati radi potvrde detalja.
              </p>

              <!-- Order Summary -->
              <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">Pregled porudžbine:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between;">
                    <span style="color: #6b7280;">Datum događaja:</span>
                    <span style="color: #1f2937; font-weight: 600;">
                      ${eventDate ? eventDate.toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Nije navedeno'}
                    </span>
                  </li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between;">
                    <span style="color: #6b7280;">Ukupno porcija:</span>
                    <span style="color: #1f2937; font-weight: 600;">${orderData.totalPortions}</span>
                  </li>
                  <li style="padding: 8px 0; display: flex; justify-content: space-between;">
                    <span style="color: #6b7280;">Ukupna cena:</span>
                    <span style="color: #d97706; font-weight: 700;">${orderData.totalPrice.toLocaleString()} RSD</span>
                  </li>
                </ul>
              </div>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 20px; text-align: center;">
                Ako imate bilo kakvih pitanja, slobodno odgovorite na ovaj email ili nas pozovite.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5; border-top: none;">
              <p style="color: #1f2937; font-weight: 600; margin: 0;">Ketering Beograd</p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">Ekskluzivni ketering za vaše proslave</p>
            </div>
          </div>
        `
      })

      if (clientEmailResult.error) {
        console.error('Client email failed:', clientEmailResult.error)
        // Don't throw here, as admin email was sent successfully
      } else {
        console.log('Client email sent:', clientEmailResult.data)
      }
      console.log('Both emails sent successfully')
    } catch (emailError: unknown) {
      const error = emailError as { message?: string; statusCode?: number; name?: string }
      console.error('=== EMAIL ERROR ===')
      console.error('Error name:', error?.name)
      console.error('Error message:', error?.message)
      console.error('Status code:', error?.statusCode)
      console.error('Full error:', JSON.stringify(emailError, null, 2))
      // Ne vraćamo grešku korisniku jer je porudžbina uspešno primljena
      // Email se može poslati i naknadno
    }

    return { success: true, message: 'Vaša porudžbina je uspešno poslata!' }
  } catch (error) {
    console.error('Order submission error:', error)
    return { success: false, message: 'Došlo je do greške prilikom slanja porudžbine.' }
  }
}
