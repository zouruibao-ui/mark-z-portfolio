import 'server-only'
import { works } from '@/data/works'
import { siteConfig, skills, experiences } from '@/data/site-config'
import type { WorkItem } from '@/lib/types'
import type { DbWorkItem, DbSiteConfig } from '@/lib/db'

/**
 * Seed module — converts the static data files into the database shape.
 * Used by the /api/init route to bootstrap an empty KV store.
 */

export function buildSeedWorks(): DbWorkItem[] {
  return works.map((w: WorkItem, i: number) => ({
    id: w.id,
    title: w.title,
    category: w.category,
    tags: w.tags,
    year: w.year,
    status: w.status,
    role: w.role,
    organization: w.organization,
    coverImage: w.coverImage,
    summary: w.summary,
    featured: w.featured,
    results: w.results,
    evidence: w.evidence || [],
    modules: w.modules || [],
    relatedIds: w.relatedIds || [],
    order: i,
    createdAt: new Date(2026, 0, 1).toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

export function buildSeedConfig(): DbSiteConfig {
  return {
    title: siteConfig.title,
    subtitle: siteConfig.subtitle,
    description: siteConfig.description,
    author: siteConfig.author,
    email: siteConfig.email,
    phone: siteConfig.phone,
    wechatQr: siteConfig.wechatQr,
    socialLinks: siteConfig.socialLinks,
    jobStatus: siteConfig.jobStatus,
    adminEmail: process.env.ADMIN_EMAIL || siteConfig.email,
    adminBackupEmail: process.env.ADMIN_BACKUP_EMAIL || '',
  }

  // skills / experiences intentionally not part of DbSiteConfig —
  // they remain static in site-config.ts (no admin editing for now).
}

export function getAdminEmailsFromEnv(): string[] {
  const primary = process.env.ADMIN_EMAIL
  const backup = process.env.ADMIN_BACKUP_EMAIL
  return [primary, backup].filter(Boolean) as string[]
}