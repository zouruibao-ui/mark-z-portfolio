import { NextResponse } from 'next/server'
import { getPersonalStats } from '@/lib/db'
import { getSession } from '@/lib/auth'

/**
 * GET /api/stats — admin only, returns personal center stats
 */
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await getPersonalStats()
    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}