import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { readdir, stat } from 'fs/promises'
import path from 'path'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dishesDir = path.join(process.cwd(), 'public', 'dishes')
    
    const files: { name: string; url: string; type: 'image' | 'video'; size?: number }[] = []
    
    try {
      const entries = await readdir(dishesDir)
      
      for (const entry of entries) {
        if (entry === 'README.md') continue
        
        const filePath = path.join(dishesDir, entry)
        const fileStat = await stat(filePath)
        
        if (fileStat.isFile()) {
          const ext = path.extname(entry).toLowerCase()
          const isVideo = ['.mp4', '.webm', '.mov'].includes(ext)
          const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
          
          if (isImage || isVideo) {
            files.push({
              name: entry,
              url: `/dishes/${entry}`,
              type: isVideo ? 'video' : 'image',
              size: fileStat.size,
            })
          }
        }
      }
    } catch {
      // Directory doesn't exist yet, that's fine
    }
    
    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error listing media:', error)
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 })
  }
}
