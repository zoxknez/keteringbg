'use server';

import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

interface OrderMenuItem {
  menuId: string;
  menuName: string;
  portions: number;
  pricePerPortion: number;
  totalPrice: number;
  dishCount: number;
  selectedDishIds: string[];
}

interface OrderData {
  orders: OrderMenuItem[];
  totalPrice: number;
  totalPortions: number;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const categoryTranslations: Record<string, Record<string, string>> = {
  sr: {
    'SALAD': 'Salata',
    'MAIN': 'Glavno jelo',
    'SIDE': 'Prilog',
    'DESSERT': 'Dezert',
  },
  en: {
    'SALAD': 'Salad',
    'MAIN': 'Main course',
    'SIDE': 'Side dish',
    'DESSERT': 'Dessert',
  },
  ru: {
    'SALAD': 'Салат',
    'MAIN': 'Основное блюдо',
    'SIDE': 'Гарнир',
    'DESSERT': 'Десерт',
  },
};

const localeLabels: Record<string, string> = {
  sr: '🇷🇸 Srpski',
  en: '🇬🇧 English',
  ru: '🇷🇺 Русский',
};

export async function submitOrder(
  _prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    // Parse order data
    const orderDataJson = formData.get('orderData') as string;
    const orderData: OrderData = JSON.parse(orderDataJson);
    
    // Customer details
    const customerName = formData.get('clientName') as string;
    const customerPhone = formData.get('clientPhone') as string;
    const customerEmail = formData.get('clientEmail') as string;
    const address = formData.get('address') as string;
    const eventDate = formData.get('eventDate') as string;
    const message = formData.get('message') as string || '';
    const locale = formData.get('locale') as string || 'sr';

    console.log('=== ORDER SUBMISSION START ===');
    console.log('Customer:', customerName, customerPhone, customerEmail);
    console.log('Address:', address);
    console.log('Event Date:', eventDate);
    console.log('Message:', message);
    console.log('Locale:', locale);
    console.log('Order Data:', JSON.stringify(orderData, null, 2));

    const { orders, totalPrice, totalPortions } = orderData;

    // Get category translations for this locale
    const catTrans = categoryTranslations[locale] || categoryTranslations['sr'];
    const localeLabel = localeLabels[locale] || locale;

    // Format event date
    const eventDateFormatted = new Date(eventDate).toLocaleString('sr-RS', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Build email content for each menu
    let menuSections = '';
    
    for (const order of orders) {
      // Fetch dishes with categories for this menu
      const dishes = await prisma.dish.findMany({
        where: { id: { in: order.selectedDishIds } },
        select: {
          id: true,
          name: true,
          category: true,
        }
      });

      // Group dishes by category
      const dishesByCategory: Record<string, string[]> = {};
      dishes.forEach((dish: { id: string; name: string; category: string }) => {
        const category = dish.category;
        if (!dishesByCategory[category]) {
          dishesByCategory[category] = [];
        }
        dishesByCategory[category].push(dish.name);
      });

      // Create dishes list by category
      let categoryBlocks = '';
      const categoryOrder = ['SALAD', 'MAIN', 'SIDE', 'DESSERT', 'APPETIZER'];
      categoryOrder.forEach(cat => {
        if (dishesByCategory[cat] && dishesByCategory[cat].length > 0) {
          const catName = catTrans[cat] || cat;
          categoryBlocks += `
            <div style="margin-bottom: 8px;">
              <strong style="color: #4a5568;">${catName}:</strong>
              <span style="color: #2d3748;">${dishesByCategory[cat].join(', ')}</span>
            </div>
          `;
        }
      });
      
      menuSections += `
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 16px; border-left: 4px solid #3b82f6;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="margin: 0; color: #1e40af; font-size: 18px;">${order.menuName}</h3>
            <span style="background-color: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
              x${order.portions}
            </span>
          </div>
          ${categoryBlocks}
          <div style="border-top: 1px solid #e2e8f0; margin-top: 12px; padding-top: 12px; text-align: right;">
            <span style="color: #64748b;">Cena po meniju: ${order.pricePerPortion} RSD</span>
            <br/>
            <strong style="color: #1e40af; font-size: 16px;">Ukupno: ${order.totalPrice.toLocaleString()} RSD</strong>
          </div>
        </div>
      `;
    }

    // Email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nova Porudžbina - BAUK</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f1f5f9;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🍽️ Nova Porudžbina</h1>
          <p style="color: #93c5fd; margin: 10px 0 0 0; font-size: 14px;">BAUK Ketering</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <span style="color: #92400e; font-weight: 500;">🌐 Jezik korišćen: ${localeLabel}</span>
          </div>
          
          <div style="background-color: #f0fdf4; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
            <h2 style="margin: 0 0 12px 0; color: #166534; font-size: 16px;">👤 Podaci o kupcu</h2>
            <p style="margin: 0; color: #2d3748;"><strong>Ime:</strong> ${customerName}</p>
            <p style="margin: 8px 0 0 0; color: #2d3748;"><strong>Telefon:</strong> <a href="tel:${customerPhone}" style="color: #166534; text-decoration: none;">${customerPhone}</a></p>
            <p style="margin: 8px 0 0 0; color: #2d3748;"><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #166534; text-decoration: none;">${customerEmail}</a></p>
          </div>

          <div style="background-color: #eff6ff; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
            <h2 style="margin: 0 0 12px 0; color: #1e40af; font-size: 16px;">📍 Detalji isporuke</h2>
            <p style="margin: 0; color: #2d3748;"><strong>Adresa:</strong> ${address}</p>
            <p style="margin: 8px 0 0 0; color: #2d3748;"><strong>Datum i vreme:</strong> ${eventDateFormatted}</p>
            ${message ? `<p style="margin: 8px 0 0 0; color: #2d3748;"><strong>Napomena:</strong> ${message}</p>` : ''}
          </div>

          <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 16px;">📋 Poručeni meniji</h2>
          
          ${menuSections}

          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); border-radius: 8px; padding: 20px; margin-top: 20px; text-align: center;">
            <span style="color: #93c5fd; font-size: 14px;">UKUPNO ZA PLAĆANJE</span>
            <div style="color: #ffffff; font-size: 32px; font-weight: bold; margin-top: 8px;">
              ${totalPrice.toLocaleString()} RSD
            </div>
            <span style="color: #93c5fd; font-size: 12px;">(${orders.length} ${orders.length === 1 ? 'meni' : orders.length < 5 ? 'menija' : 'menija'}, ${totalPortions} obroka)</span>
          </div>
          
          <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              Ova porudžbina je primljena putem BAUK sajta<br/>
              ${new Date().toLocaleString('sr-RS', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    console.log('=== SENDING EMAIL ===');
    console.log('API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('API Key prefix:', process.env.RESEND_API_KEY?.substring(0, 10));
    
    const { data, error } = await resend.emails.send({
      from: 'BAUK Porudžbine <onboarding@resend.dev>',
      to: ['spalevic.dragan@gmail.com'],
      subject: `Nova Porudžbina - ${customerName} (${totalPortions} obroka, ${totalPrice.toLocaleString()} RSD)`,
      html: emailHtml,
    });

    console.log('=== EMAIL RESPONSE ===');
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Error:', JSON.stringify(error, null, 2));

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Email failed: ' + error.message };
    }

    console.log('Email sent successfully:', data);
    console.log('=== ORDER SUBMISSION END ===');

    return { success: true, message: 'Order submitted successfully!' };
  } catch (error) {
    console.error('Order submission error:', error);
    return { success: false, message: 'Failed to submit order. Please try again.' };
  }
}
