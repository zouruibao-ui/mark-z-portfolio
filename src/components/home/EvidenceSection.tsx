'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Monitor, Languages, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/* ------------------------------------------------------------------ */
/*  Stat data                                                         */
/* ------------------------------------------------------------------ */

const evidenceStats = [
  {
    id: 'content',
    number: 50,
    suffix: '+',
    labelZh: '内容作品',
    labelEn: 'Content Works',
    Icon: FileText,
  },
  {
    id: 'platforms',
    number: 5,
    suffix: '+',
    labelZh: '平台',
    labelEn: 'Platforms',
    Icon: Monitor,
  },
  {
    id: 'bilingual',
    number: null,
    textZh: '中英双语',
    textEn: 'Bilingual (CN/EN)',
    Icon: Languages,
  },
  {
    id: 'ai',
    number: null,
    textZh: 'AI驱动',
    textEn: 'AI-Driven',
    Icon: Sparkles,
  },
];

/* ------------------------------------------------------------------ */
/*  CountUp — simple rAF-based counter with ease-out cubic            */
/* ------------------------------------------------------------------ */

function CountUp({
  target,
  suffix,
  isInView,
}: {
  target: number;
  suffix: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const startTime = performance.now();
    let rafId: number;

    const step = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [isInView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

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
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Section component                                                 */
/* ------------------------------------------------------------------ */

export default function EvidenceSection() {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="bg-bg py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Section header */}
        <div className="mb-12 text-center md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl font-bold text-text md:text-4xl"
          >
            {t('sections.evidence')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary"
          />
        </div>

        {/* Stats grid — 2x2 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-4 md:gap-8"
        >
          {evidenceStats.map((stat) => {
            const hasNumber = stat.number !== null;
            const label = language === 'zh' ? stat.labelZh : stat.labelEn;
            const text = language === 'zh' ? stat.textZh : stat.textEn;

            return (
              <motion.div
                key={stat.id}
                variants={cardVariants}
                className="group flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-10"
              >
                {/* Icon */}
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 md:h-12 md:w-12">
                  <stat.Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>

                {/* Value */}
                <div className="mb-1 text-3xl font-bold text-text md:text-5xl">
                  {hasNumber ? (
                    <CountUp target={stat.number!} suffix={stat.suffix} isInView={isInView} />
                  ) : (
                    <span className="text-2xl md:text-3xl">{text}</span>
                  )}
                </div>

                {/* Label (number-based stats only) */}
                {hasNumber && (
                  <p className="text-sm text-text-secondary md:text-base">
                    {label}
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}