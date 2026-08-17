import { NextRequest, NextResponse } from 'next/server'
import { getWorks, saveWork, getSiteConfig } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { DbWorkItem } from '@/lib/db'

/**
 * GET /api/works — public, returns all works
 * POST /api/works — admin only, creates a new work
 */

export async function GET() {
  try {
    const works = await getWorks()
    return NextResponse.json({ works })
  } catch (error) {
    console.error('Get works error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, category, tags, year, status, role, organization, coverImage, summary, featured, results } = body

    if (!id || !title || !category) {
      return NextResponse.json({ error: 'id, title, and category are required' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const work: DbWorkItem = {
      id,
      title: typeof title === 'object' ? title : { zh: title, en: '' },
      category,
      tags: tags || [],
      year: year || '',
      status: status || 'draft',
      role: role || { zh: '', en: '' },
      organization: organization || { zh: '', en: '' },
      coverImage: coverImage || '',
      summary: summary || { zh: '', en: '' },
      featured: featured || false,
      results: results || { zh: '', en: '' },
      evidence: [],
      modules: [],
      relatedIds: [],
      order: 0,
      createdAt: now,
      updatedAt: now,
    }

    await saveWork(work)
    return NextResponse.json({ success: true, work })
  } catch (error) {
    console.error('Create work error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}