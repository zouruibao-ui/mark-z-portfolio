'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Globe, Users, Sparkles, Compass, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/* ------------------------------------------------------------------ */
/*  Trait icon mapping                                                */
/* ------------------------------------------------------------------ */

const TRAIT_ICONS = {
  'global-vision': Globe,
  collaborative: Users,
  'tech-explorer': Sparkles,
  'brand-sensitive': Compass,
} as const;

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Section component                                                 */
/* ------------------------------------------------------------------ */

export default function AboutSummary() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const traitKeys = ['global-vision', 'collaborative', 'tech-explorer', 'brand-sensitive'] as const;

  return (
    <section ref={sectionRef} className="bg-bg py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Section header */}
        <div className="mb-6 text-center md:mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl font-bold text-text md:text-4xl"
          >
            {t('sections.aboutSummary')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary"
          />
        </div>

        {/* Brief description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="mx-auto mb-10 max-w-2xl text-center text-lg leading-relaxed text-text-secondary md:mb-14"
        >
          {t('aboutSummary.description')}
        </motion.p>

        {/* Trait cards grid — 2 cols on mobile, 4 on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-4 md:gap-6"
        >
          {traitKeys.map((key) => {
            const Icon = TRAIT_ICONS[key];
            const title = t(`aboutSummary.traits.${key}.title`);
            const desc = t(`aboutSummary.traits.${key}.desc`);

            return (
              <motion.div
                key={key}
                variants={cardVariants}
                className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-6"
              >
                {/* Icon */}
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 md:h-12 md:w-12">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>

                {/* Title */}
                <h3 className="mb-1.5 text-base font-semibold text-text md:text-lg">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-text-secondary">
                  {desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
          className="mt-10 text-center md:mt-14"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/5 hover:shadow-sm"
          >
            {t('aboutSummary.cta')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}