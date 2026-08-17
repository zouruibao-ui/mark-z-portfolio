import { NextRequest, NextResponse } from 'next/server'
import { getWork, saveWork } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { DbWorkItem } from '@/lib/db'

/**
 * POST /api/works/[id]/duplicate
 * Admin only. Creates a copy of the work with a new ID.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const original = await getWork(id)
    if (!original) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    const now = new Date()
    const newId = `${original.id}-copy-${now.getTime()}`
    const copy: DbWorkItem = {
      ...original,
      id: newId,
      title: {
        zh: `${original.title.zh} (副本)`,
        en: `${original.title.en} (Copy)`,
      },
      status: 'draft',
      featured: false,
      order: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    await saveWork(copy)
    return NextResponse.json({ success: true, work: copy })
  } catch (error) {
    console.error('Duplicate work error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}