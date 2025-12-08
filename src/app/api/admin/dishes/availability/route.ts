import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT bulk availability update
export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { action } = body

    if (action === 'enableAll') {
      await prisma.dish.updateMany({
        data: { isAvailable: true }
      })
    } else if (action === 'disableAll') {
      await prisma.dish.updateMany({
        data: { isAvailable: false }
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
