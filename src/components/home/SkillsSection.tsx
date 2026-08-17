'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lightbulb, Globe, Bot } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { skills } from '@/data/site-config';

/* ------------------------------------------------------------------ */
/*  Icon & colour mapping per skill id                                */
/* ------------------------------------------------------------------ */

const SKILL_ICONS = {
  'brand-ip': Lightbulb,
  'international-communication': Globe,
  'ai-collaboration': Bot,
} as const;

const SKILL_COLORS = {
  'brand-ip': {
    border: 'border-l-primary/40',
    bg: 'bg-primary/5',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  'international-communication': {
    border: 'border-l-accent/40',
    bg: 'bg-accent/5',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  'ai-collaboration': {
    border: 'border-l-amber-400/40',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
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

export default function SkillsSection() {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="bg-bg-alt py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Section header */}
        <div className="mb-12 text-center md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl font-bold text-text md:text-4xl"
          >
            {t('sections.abilities')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary"
          />
        </div>

        {/* Skills grid — 1 col on mobile, 3 on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {skills.map((skill) => {
            const Icon = SKILL_ICONS[skill.id as keyof typeof SKILL_ICONS];
            const colors =
              SKILL_COLORS[skill.id as keyof typeof SKILL_COLORS];
            const title = skill[language].title;
            const desc = skill[language].desc;

            return (
              <motion.div
                key={skill.id}
                variants={cardVariants}
                className={`group rounded-xl border border-border bg-card border-l-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${colors.border} ${colors.bg}`}
              >
                {/* Icon */}
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${colors.iconBg} ${colors.iconColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-text">
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
      </div>
    </section>
  );
}