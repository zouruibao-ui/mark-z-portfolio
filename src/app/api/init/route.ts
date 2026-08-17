import { NextResponse } from 'next/server'
import { getWorks, getSiteConfig, setJSON } from '@/lib/db'
import { buildSeedWorks, buildSeedConfig, buildSeedAccess, buildSeedLayout, buildSeedContent } from '@/lib/seed'

const KEYS = { works: 'markz:works', config: 'markz:config', access: 'markz:access', layout: 'markz:layout', content: 'markz:content' }

/**
 * POST /api/init
 * Seeds the database with initial data if it's empty.
 * Idempotent — safe to call on every deploy.
 */
export async function POST() {
  try {
    const results: string[] = []

    const existingWorks = await getWorks()
    if (existingWorks.length === 0) {
      const seedWorks = buildSeedWorks()
      await setJSON(KEYS.works, seedWorks)
      results.push(`Seeded ${seedWorks.length} works`)
    } else {
      results.push(`Works already exist (${existingWorks.length}), skipping`)
    }

    const existingConfig = await getSiteConfig()
    if (!existingConfig) {
      const seedConfig = buildSeedConfig()
      await setJSON(KEYS.config, seedConfig)
      results.push('Seeded site config')
    } else {
      results.push('Config already exists, skipping')
    }

    // Seed access control
    const existingAccess = await getJSON(KEYS.access)
    if (!existingAccess) {
      await setJSON(KEYS.access, buildSeedAccess())
      results.push('Seeded access control')
    } else {
      results.push('Access control already exists, skipping')
    }

    // Seed layout
    const existingLayout = await getJSON(KEYS.layout)
    if (!existingLayout) {
      await setJSON(KEYS.layout, buildSeedLayout())
      results.push('Seeded layout config')
    } else {
      results.push('Layout config already exists, skipping')
    }

    // Seed editable content
    const existingContent = await getJSON(KEYS.content)
    if (!existingContent) {
      await setJSON(KEYS.content, buildSeedContent())
      results.push('Seeded editable content')
    } else {
      results.push('Editable content already exists, skipping')
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getJSON(key: string): Promise<any> {
  try {
    const { getSiteAccess, getLayoutConfig, getEditableContent } = await import('@/lib/db')
    if (key === KEYS.access) return getSiteAccess()
    if (key === KEYS.layout) return getLayoutConfig()
    if (key === KEYS.content) return getEditableContent()
    return null
  } catch {
    return null
  }
}