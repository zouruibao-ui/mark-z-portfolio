import { NextResponse } from 'next/server'
import { getWorks, getSiteConfig, getSiteAccess, isDev } from '@/lib/db'

/**
 * GET /api/storage/health
 * Diagnoses whether production storage (Upstash Redis) is configured.
 * Used by the personal center to warn the admin when persistence is not durable.
 */
export async function GET() {
  const hasUpstash =
    typeof process.env.UPSTASH_REDIS_REST_URL === 'string' &&
    process.env.UPSTASH_REDIS_REST_URL.length > 0 &&
    typeof process.env.UPSTASH_REDIS_REST_TOKEN === 'string' &&
    process.env.UPSTASH_REDIS_REST_TOKEN.length > 0

  let worksCount = 0
  let configCount = 0
  let durable = false

  try {
    const works = await getWorks()
    worksCount = Array.isArray(works) ? works.length : 0
    const config = await getSiteConfig()
    configCount = config ? 1 : 0
    const access = await getSiteAccess()
    durable = access !== null && worksCount > 0
  } catch (e) {
    // storage layer degraded
  }

  return NextResponse.json({
    environment: process.env.VERCEL ? 'vercel' : isDev ? 'development' : 'other',
    hasUpstash,
    storageMode: hasUpstash ? 'upstash-redis' : isDev ? 'local-json-file' : 'EPHEMERAL-MEMORY-ONLY',
    worksCount,
    configCount,
    durable,
    note: hasUpstash
      ? 'Persistent'
      : isDev
        ? 'Local JSON file (dev only)'
        : 'WARNING: No persistent storage configured! Admin edits will be LOST on cold starts. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel project settings.',
  })
}