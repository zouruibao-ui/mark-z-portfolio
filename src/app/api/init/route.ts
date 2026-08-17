import { NextResponse } from 'next/server'
import { getWorks, getSiteConfig, setJSON } from '@/lib/db'
import { buildSeedWorks, buildSeedConfig } from '@/lib/seed'

const KEYS = { works: 'markz:works', config: 'markz:config' }

/**
 * POST /api/init
 * Seeds the database with initial data if it's empty.
 * Idempotent — safe to call on every deploy.
 */
export async function POST() {
  try {
    const results: string[] = []

    // Check and seed works
    const existingWorks = await getWorks()
    if (existingWorks.length === 0) {
      const seedWorks = buildSeedWorks()
      await setJSON(KEYS.works, seedWorks)
      results.push(`Seeded ${seedWorks.length} works`)
    } else {
      results.push(`Works already exist (${existingWorks.length}), skipping`)
    }

    // Check and seed config
    const existingConfig = await getSiteConfig()
    if (!existingConfig) {
      const seedConfig = buildSeedConfig()
      await setJSON(KEYS.config, seedConfig)
      results.push('Seeded site config')
    } else {
      results.push('Config already exists, skipping')
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}