import { NextRequest, NextResponse } from 'next/server'
import { getEditableContent, saveEditableContent, updateEditableContent } from '@/lib/db'
import { getSession } from '@/lib/auth'

/**
 * GET /api/content — public, returns all editable content
 * PUT /api/content — admin only, updates a single content item
 * POST /api/content — admin only, saves all content items
 */
export async function GET() {
  try {
    const content = await getEditableContent()
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Get content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { key, zh, en } = await request.json()
    if (!key) {
      return NextResponse.json({ error: 'key is required' }, { status: 400 })
    }

    const updated = await updateEditableContent(key, { zh, en })
    if (!updated) {
      return NextResponse.json({ error: 'Content key not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, content: updated })
  } catch (error) {
    console.error('Update content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()
    if (!Array.isArray(content)) {
      return NextResponse.json({ error: 'content must be an array' }, { status: 400 })
    }

    await saveEditableContent(content)
    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Save content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}