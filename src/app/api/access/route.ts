import { NextRequest, NextResponse } from 'next/server'
import { getSiteAccess, saveSiteAccess } from '@/lib/db'
import { getSession } from '@/lib/auth'

/**
 * GET /api/access — public (returns sanitized access control)
 * PUT /api/access — admin only, update access control
 */
export async function GET() {
  try {
    const access = await getSiteAccess()
    // Sanitize: don't expose bypassToken to the public
    const { bypassToken, ...safe } = access
    return NextResponse.json({ access: safe })
  } catch (error) {
    console.error('Get access error:', error)
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
    const existing = await getSiteAccess()
    const access = { ...existing, ...updates }
    await saveSiteAccess(access)
    const { bypassToken, ...safe } = access
    return NextResponse.json({ success: true, access: safe })
  } catch (error) {
    console.error('Update access error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}