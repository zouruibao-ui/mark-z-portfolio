export type WorkStatus = 'published' | 'in-progress' | 'pending-result' | 'awarded' | 'archived' | 'internal-only'
export type WorkCategory = 'brand-ip' | 'journalism' | 'video-documentary' | 'ai-creative'
export type Language = 'zh' | 'en'

export interface WorkEvidence {
  type: 'link' | 'screenshot' | 'certificate' | 'data'
  label: string
  url?: string
  description: string
  isPublic: boolean
}

export interface WorkModule {
  id: string
  type: 'text' | 'image' | 'video' | 'gallery' | 'link' | 'quote'
  content: any
  zh: string
  en: string
}

export interface WorkItem {
  id: string
  title: { zh: string; en: string }
  category: WorkCategory
  tags: string[]
  year: string
  status: WorkStatus
  role: { zh: string; en: string }
  organization: { zh: string; en: string }
  coverImage: string
  summary: { zh: string; en: string }
  featured: boolean
  results: { zh: string; en: string }
  evidence: WorkEvidence[]
  modules: WorkModule[]
  relatedIds: string[]
  createdAt: string
  updatedAt: string
}

export interface SiteConfig {
  title: string
  subtitle: { zh: string; en: string }
  description: { zh: string; en: string }
  author: string
  email: string
  phone: string
  wechatQr: string
  socialLinks: { platform: string; url: string; label: string }[]
  jobStatus: { zh: string; en: string }
  adminEmail: string
  adminBackupEmail: string
}

export interface Skill {
  icon: string
  title: { zh: string; en: string }
  description: { zh: string; en: string }
}

export interface Experience {
  company: { zh: string; en: string }
  role: { zh: string; en: string }
  period: { zh: string; en: string }
  description: { zh: string; en: string }
  highlights: { zh: string[]; en: string[] }
}