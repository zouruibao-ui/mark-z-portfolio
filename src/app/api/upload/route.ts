import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

/**
 * POST /api/upload
 * Uploads a file (image, PDF, document) and returns the public URL.
 * Uses @vercel/blob in production, falls back to local public/uploads/ in dev.
 */

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as string) || 'image'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Try Vercel Blob first
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob')
        const timestamp = Date.now()
        const ext = file.name.split('.').pop() || 'jpg'
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `works/${timestamp}-${safeName}`
        const blob = await put(filename, file, { access: 'public' })
        return NextResponse.json({ success: true, url: blob.url, filename })
      } catch (blobError) {
        console.error('Vercel Blob upload failed:', blobError)
        // Fall through to local fallback
      }
    }

    // Fallback: save to public/uploads for local development
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      const fs = await import('fs')
      const path = await import('path')
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      const timestamp = Date.now()
      const ext = file.name.split('.').pop() || 'jpg'
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filename = `${timestamp}-${safeName}`
      const buffer = Buffer.from(await file.arrayBuffer())
      fs.writeFileSync(path.join(uploadDir, filename), buffer)
      return NextResponse.json({ success: true, url: `/uploads/${filename}`, filename })
    }

    return NextResponse.json(
      { error: 'Upload failed. Configure BLOB_READ_WRITE_TOKEN for production, or run in development mode.' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}