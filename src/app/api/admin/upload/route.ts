import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'dishes'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Max file size: 10MB for images, 50MB for videos
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Upload to Vercel Blob
    // Generate unique filename with timestamp to prevent conflicts
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop() || ''
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-')
    const uniqueFilename = `${type}/${baseName}-${timestamp}-${randomId}.${ext}`
    
    console.log('Uploading file:', uniqueFilename, 'Size:', file.size, 'Type:', file.type)
    
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      addRandomSuffix: false, // We already added unique suffix
    })

    console.log('Upload successful:', blob.url)
    return NextResponse.json({ url: blob.url, filename: blob.pathname })
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
