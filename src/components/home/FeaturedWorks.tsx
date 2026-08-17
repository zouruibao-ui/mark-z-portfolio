'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { works } from '@/data/works';
import { STATUS_COLORS, CATEGORY_EMOJI } from '@/lib/constants';
import type { WorkItem } from '@/lib/types';
import dynamic from 'next/dynamic';

const WorkActions = dynamic(() => import('@/components/admin/WorkActions'), { ssr: false })

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const featuredWorks = works.filter((w) => w.featured).slice(0, 5);

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Status colour & category emoji (from shared constants)            */
/* ------------------------------------------------------------------ */

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
          <WorkActions workId={item.id} workStatus={item.status} />
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
/*  Section component                                                 */
/* ------------------------------------------------------------------ */

export default function FeaturedWorks() {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  if (featuredWorks.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Section header */}
        <div className="mb-12 text-center md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl font-bold text-text md:text-4xl"
          >
            {t('sections.featuredWorks')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary"
          />
        </div>

        {/* Works grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuredWorks.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
          className="mt-10 text-center"
        >
          <Link
            href="/works"
            className="group inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-dark"
          >
            <span>
              {language === 'zh' ? '查看全部作品' : 'View All Works'}
            </span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}