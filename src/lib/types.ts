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

// ============================================================
// Personal Center types
// ============================================================

export type SiteMode = 'open' | 'maintenance' | 'closed'

export interface AccessSchedule {
  enabled: boolean
  mode: SiteMode
  /** ISO timestamp when the schedule should take effect */
  scheduledAt: string | null
  /** Duration in minutes the schedule should last (0 = indefinite) */
  durationMinutes: number
  /** Current mode BEFORE the schedule takes effect (for rollback) */
  previousMode: SiteMode
  /** Human-readable label */
  label: string
}

export interface SiteAccessControl {
  currentMode: SiteMode
  schedules: AccessSchedule[]
  /** Custom message shown when site is closed/maintenance */
  closedMessage: { zh: string; en: string }
  /** Password to bypass the closed/maintenance page */
  bypassToken: string
  /** Whether the admin is currently bypassing */
  bypassActive: boolean
}

export interface SectionConfig {
  id: string
  visible: boolean
  order: number
}

export interface LayoutConfig {
  sections: SectionConfig[]
  /** Home page hero subtitle override */
  heroSubtitle: { zh: string; en: string } | null
  /** About page photo URL */
  aboutPhoto: string
}

export interface EditableContent {
  key: string
  zh: string
  en: string
  /** Category for grouping in the admin UI */
  category: 'hero' | 'about' | 'skills' | 'experience' | 'evidence' | 'footer' | 'seo'
  /** Description shown in the admin UI */
  description: string
  updatedAt: string
}

export interface PersonalCenterStats {
  totalWorks: number
  publishedWorks: number
  totalViews: number
  siteMode: SiteMode
  sectionsVisible: number
  sectionsHidden: number
  lastDeploy: string | null
}