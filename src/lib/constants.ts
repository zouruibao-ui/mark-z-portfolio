import type { WorkStatus, WorkCategory } from '@/lib/types'

/**
 * Shared design constants used across work cards,
 * list pages and detail pages (kept in sync).
 */

export const STATUS_COLORS: Record<WorkStatus, string> = {
  awarded: 'bg-amber-100 text-amber-800 border-amber-200',
  published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'pending-result': 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
  archived: 'bg-gray-100 text-gray-600 border-gray-200',
  'internal-only': 'bg-red-100 text-red-800 border-red-200',
};

export const CATEGORY_EMOJI: Record<WorkCategory, string> = {
  'brand-ip': '\u{1F3F7}\u{FE0F}',
  'journalism': '\u{1F4F0}',
  'video-documentary': '\u{1F3AC}',
  'ai-creative': '\u{1F916}',
};

export const CATEGORY_LABELS: Record<WorkCategory, { zh: string; en: string }> = {
  'brand-ip': { zh: '品牌与IP', en: 'Brand & IP' },
  'journalism': { zh: '新闻与报道', en: 'Journalism' },
  'video-documentary': { zh: '视频与纪录片', en: 'Video & Documentary' },
  'ai-creative': { zh: 'AI与创意', en: 'AI & Creative' },
};

export const STATUS_LABELS: Record<WorkStatus, { zh: string; en: string }> = {
  awarded: { zh: '已获奖', en: 'Awarded' },
  published: { zh: '已发布', en: 'Published' },
  'pending-result': { zh: '待出结果', en: 'Pending Result' },
  'in-progress': { zh: '进行中', en: 'In Progress' },
  archived: { zh: '已归档', en: 'Archived' },
  'internal-only': { zh: '内部资料', en: 'Internal Only' },
};