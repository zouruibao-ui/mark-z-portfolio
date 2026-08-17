import { NextRequest, NextResponse } from 'next/server'
import { getSiteConfig, saveSiteConfig } from '@/lib/db'
import { getSession } from '@/lib/auth'

/**
 * GET /api/config — public, returns site config
 * PUT /api/config — admin only, updates site config
 */

export async function GET() {
  try {
    const config = await getSiteConfig()
    if (!config) {
      return NextResponse.json({ error: 'No config found' }, { status: 404 })
    }
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Get config error:', error)
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
    const existing = await getSiteConfig()
    const config = { ...(existing || {}), ...updates }
    await saveSiteConfig(config)

    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error('Update config error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}