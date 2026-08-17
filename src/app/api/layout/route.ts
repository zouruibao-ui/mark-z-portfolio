import { NextRequest, NextResponse } from 'next/server'
import { getLayoutConfig, saveLayoutConfig } from '@/lib/db'
import { getSession } from '@/lib/auth'

/**
 * GET /api/layout — public, returns layout config
 * PUT /api/layout — admin only, updates layout
 */
export async function GET() {
  try {
    const layout = await getLayoutConfig()
    return NextResponse.json({ layout })
  } catch (error) {
    console.error('Get layout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const existing = await getLayoutConfig()
    const layout = { ...existing, ...updates }
    await saveLayoutConfig(layout)
    return NextResponse.json({ success: true, layout })
  } catch (error) {
    console.error('Update layout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}