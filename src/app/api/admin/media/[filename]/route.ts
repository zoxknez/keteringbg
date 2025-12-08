import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { filename } = await params

  try {
    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(decodeURIComponent(filename))
    const filePath = path.join(process.cwd(), 'public', 'dishes', sanitizedFilename)
    
    await unlink(filePath)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
