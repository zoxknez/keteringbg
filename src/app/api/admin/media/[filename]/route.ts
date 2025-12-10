import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { del, list } from '@vercel/blob'

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
    const decodedFilename = decodeURIComponent(filename)
    
    // Find the blob by pathname to get its URL
    // We list with prefix to narrow down the search
    const { blobs } = await list({ prefix: decodedFilename, limit: 1 })
    
    // Check if we found a match
    const blob = blobs.find(b => b.pathname === decodedFilename)
    
    if (blob) {
      await del(blob.url)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
