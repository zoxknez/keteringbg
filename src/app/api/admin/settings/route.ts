import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json(null)
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    
    // Check if settings exist
    const existing = await prisma.siteSettings.findFirst()
    
    if (existing) {
      // Update existing
      const settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: {
          siteName: body.siteName,
          contactPhone: body.contactPhone,
          contactEmail: body.contactEmail,
          address: body.address,
          workingHours: body.workingHours,
          instagramUrl: body.instagramUrl,
          facebookUrl: body.facebookUrl,
          googleMapsUrl: body.googleMapsUrl,
          footerText: body.footerText,
        }
      })
      return NextResponse.json(settings)
    } else {
      // Create new
      const settings = await prisma.siteSettings.create({
        data: {
          siteName: body.siteName,
          contactPhone: body.contactPhone,
          contactEmail: body.contactEmail,
          address: body.address,
          workingHours: body.workingHours,
          instagramUrl: body.instagramUrl,
          facebookUrl: body.facebookUrl,
          googleMapsUrl: body.googleMapsUrl,
          footerText: body.footerText,
        }
      })
      return NextResponse.json(settings)
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
