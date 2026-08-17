import { NextRequest, NextResponse } from 'next/server'
import { getWork, saveWork, deleteWork } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { DbWorkItem } from '@/lib/db'

/**
 * GET /api/works/[id] — public, returns a single work
 * PUT /api/works/[id] — admin only, updates a work
 * DELETE /api/works/[id] — admin only, deletes a work
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const work = await getWork(id)
    if (!work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }
    return NextResponse.json({ work })
  } catch (error) {
    console.error('Get work error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const existing = await getWork(id)
    if (!existing) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    const updates = await request.json()
    const updated: DbWorkItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    // Ensure nested objects aren't lost
    if (updates.title) updated.title = { ...existing.title, ...(typeof updates.title === 'object' ? updates.title : {}) }
    if (updates.summary) updated.summary = { ...existing.summary, ...(typeof updates.summary === 'object' ? updates.summary : {}) }
    if (updates.role) updated.role = { ...existing.role, ...(typeof updates.role === 'object' ? updates.role : {}) }
    if (updates.organization) updated.organization = { ...existing.organization, ...(typeof updates.organization === 'object' ? updates.organization : {}) }
    if (updates.results) updated.results = { ...existing.results, ...(typeof updates.results === 'object' ? updates.results : {}) }

    await saveWork(updated)
    return NextResponse.json({ success: true, work: updated })
  } catch (error) {
    console.error('Update work error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await deleteWork(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete work error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}