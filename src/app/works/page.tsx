'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { works } from '@/data/works';
import type { WorkItem, WorkCategory, WorkStatus } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const CATEGORIES: { key: 'all' | WorkCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'All' },
  { key: 'brand-ip', labelKey: 'categories.brand-ip.name' },
  { key: 'journalism', labelKey: 'categories.journalism.name' },
  { key: 'video-documentary', labelKey: 'categories.video-documentary.name' },
  { key: 'ai-creative', labelKey: 'categories.ai-creative.name' },
];

/* ------------------------------------------------------------------ */
/*  Status colour mapping                                             */
/* ------------------------------------------------------------------ */

const STATUS_COLORS: Record<WorkStatus, string> = {
  awarded: 'bg-amber-100 text-amber-800 border-amber-200',
  published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'pending-result': 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
  archived: 'bg-gray-100 text-gray-600 border-gray-200',
  'internal-only': 'bg-red-100 text-red-800 border-red-200',
};

/* ------------------------------------------------------------------ */
/*  Category emoji (placeholder visuals until real images exist)       */
/* ------------------------------------------------------------------ */

const CATEGORY_EMOJI: Record<WorkCategory, string> = {
  'brand-ip': '\u{1F3F7}️',
  'journalism': '\u{1F4F0}',
  'video-documentary': '\u{1F3AC}',
  'ai-creative': '\u{1F916}',
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Single work card                                                  */
/* ------------------------------------------------------------------ */

function WorkCard({ item }: { item: WorkItem }) {
  const { language, t } = useLanguage();

  const categoryName = t(`categories.${item.category}.name`);
  const statusName = t(`status.${item.status}.name`);
  const statusColor = STATUS_COLORS[item.status];

  return (
    <motion.div variants={cardVariants}>
      <Link
        href={`/works/${item.id}`}
        className="group block rounded-xl bg-card border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
      >
        {/* Cover image area */}
        <div className="relative aspect-[16/10] overflow-hidden bg-bg-alt">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 transition-transform duration-500 group-hover:scale-105">
            <span className="select-none text-5xl opacity-30 transition-opacity duration-300 group-hover:opacity-50">
              {CATEGORY_EMOJI[item.category]}
            </span>
          </div>

          {/* Status badge */}
          <span
            className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
          >
            {statusName}
          </span>
        </div>

        {/* Card body */}
        <div className="p-4 sm:p-5">
          {/* Category + year */}
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {categoryName}
            </span>
            <span className="text-xs text-text-secondary">{item.year}</span>
          </div>

          {/* Title */}
          <h3 className="mb-1.5 line-clamp-2 text-base font-semibold text-text transition-colors duration-200 group-hover:text-primary sm:text-lg">
            {item.title[language]}
          </h3>

          {/* Summary */}
          <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
            {item.summary[language]}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function WorksPage() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | WorkCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /* Filter works by category and search query */
  const filteredWorks = useMemo(() => {
    let result = works;

    if (activeCategory !== 'all') {
      result = result.filter((w) => w.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (w) =>
          w.title.zh.toLowerCase().includes(q) ||
          w.title.en.toLowerCase().includes(q) ||
          w.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          w.summary.zh.toLowerCase().includes(q) ||
          w.summary.en.toLowerCase().includes(q),
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  /* Hide search box when there are few works (PRD) */
  const showSearch = works.length > 8;

  return (
    <main className="min-h-screen py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Page header */}
        <div className="mb-8 text-center md:mb-12">
          <h1 className="text-3xl font-bold text-text md:text-4xl">
            {language === 'zh' ? '作品集' : 'Portfolio'}
          </h1>
          <p className="mt-3 text-text-secondary">
            {language === 'zh'
              ? '精选作品与项目，涵盖品牌、新闻、视频与AI创意'
              : 'Featured works and projects across branding, journalism, video, and AI creative'}
          </p>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary" />
        </div>

        {/* Category filter buttons */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const label =
              cat.key === 'all'
                ? language === 'zh'
                  ? '全部'
                  : 'All'
                : t(cat.labelKey);
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as 'all' | WorkCategory)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-bg-alt text-text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search box (hidden when few works — PRD) */}
        {showSearch && (
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'zh' ? '搜索作品...' : 'Search works...'}
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 pl-10 text-sm text-text placeholder-text-secondary outline-none transition-colors focus:border-primary"
              />
              {/* Search icon */}
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Works grid / empty state */}
        {filteredWorks.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredWorks.map((item) => (
              <WorkCard key={item.id} item={item} />
            ))}
          </motion.div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-text-secondary">
              {language === 'zh' ? '没有找到匹配的作品' : 'No matching works found'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              {language === 'zh' ? '清除筛选条件' : 'Clear filters'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}