import 'server-only'
import { works } from '@/data/works'
import { siteConfig, skills, experiences } from '@/data/site-config'
import type { WorkItem } from '@/lib/types'
import type { DbWorkItem, DbSiteConfig } from '@/lib/db'
import type { SiteAccessControl, LayoutConfig, EditableContent } from '@/lib/types'

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

export function buildSeedAccess(): SiteAccessControl {
  return {
    currentMode: 'open',
    schedules: [],
    closedMessage: {
      zh: '网站正在维护中，请稍后再访问。',
      en: 'Site is under maintenance. Please check back later.',
    },
    bypassToken: '',
    bypassActive: false,
  }
}

export function buildSeedLayout(): LayoutConfig {
  return {
    sections: [
      { id: 'hero', visible: true, order: 0 },
      { id: 'featured-works', visible: true, order: 1 },
      { id: 'skills', visible: true, order: 2 },
      { id: 'evidence', visible: true, order: 3 },
      { id: 'experience', visible: true, order: 4 },
      { id: 'about-summary', visible: true, order: 5 },
      { id: 'contact', visible: true, order: 6 },
    ],
    heroSubtitle: null,
    aboutPhoto: '',
  }
}

export function buildSeedContent(): EditableContent[] {
  return [
    { key: 'hero.subtitle', zh: '品牌策略师 / 跨文化叙事者', en: 'Brand Strategist / Cross-cultural Storyteller', category: 'hero', description: '首页副标题', updatedAt: new Date().toISOString() },
    { key: 'hero.jobStatus', zh: '📌 开放机会中 — 品牌内容 / 海外社媒 / AI产品内容', en: '📌 Open to opportunities — Brand Content / Global Social / AI Product Content', category: 'hero', description: '求职状态标签', updatedAt: new Date().toISOString() },
    { key: 'about.description', zh: '国际视野、善于协作、敢于尝试新技术、对品牌敏感', en: 'Global perspective, collaborative, tech-curious, brand-sensitive', category: 'about', description: '关于摘要描述', updatedAt: new Date().toISOString() },
    { key: 'evidence.content', zh: '50+', en: '50+', category: 'evidence', description: '内容作品数量', updatedAt: new Date().toISOString() },
    { key: 'evidence.platforms', zh: '5+', en: '5+', category: 'evidence', description: '平台数量', updatedAt: new Date().toISOString() },
    { key: 'evidence.bilingual', zh: '中英双语', en: 'Bilingual (CN/EN)', category: 'evidence', description: '双语能力', updatedAt: new Date().toISOString() },
    { key: 'evidence.ai', zh: 'AI驱动', en: 'AI-Driven', category: 'evidence', description: 'AI驱动', updatedAt: new Date().toISOString() },
    { key: 'seo.description', zh: 'Mark Z 的个人作品集网站，展示品牌内容、国际传播与AI创意作品', en: "Mark Z's portfolio showcasing brand content, international communication & AI creative works", category: 'seo', description: 'SEO描述', updatedAt: new Date().toISOString() },
  ]
}