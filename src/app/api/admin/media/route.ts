import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { list } from '@vercel/blob'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { blobs } = await list()
    
    const files = blobs.map(blob => {
      const ext = blob.pathname.split('.').pop()?.toLowerCase() || ''
      const isVideo = ['mp4', 'webm', 'mov'].includes(ext)
      
      return {
        name: blob.pathname,
        url: blob.url,
        type: isVideo ? 'video' : 'image',
        size: blob.size,
        lastModified: blob.uploadedAt
      }
    })
    
    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error listing media:', error)
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 })
  }
}
