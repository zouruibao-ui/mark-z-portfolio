import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

/**
 * POST /api/access/bypass
 * Sets the admin bypass cookie so the authenticated admin
 * can view the site even when it's in closed/maintenance mode.
 *
 * Body: { active: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { active } = await request.json()
    const res = NextResponse.json({ success: true, bypassActive: !!active })

    if (active) {
      res.cookies.set('bypass_active', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24h
        path: '/',
      })
    } else {
      res.cookies.delete('bypass_active')
    }

    return res
  } catch (error) {
    console.error('Set bypass error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}