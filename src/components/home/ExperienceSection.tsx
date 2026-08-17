'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { experiences } from '@/data/site-config';

export default function ExperienceSection() {
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
            {t('sections.experience')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary"
          />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — centered on desktop, left-aligned on mobile */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" />
          <div className="absolute left-[18px] top-0 h-full w-0.5 bg-border md:hidden" />

          {experiences.map((exp, index) => {
            const data = exp[language];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                className="relative mb-12 last:mb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-[10px] top-6 z-10 md:left-1/2 md:-translate-x-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.15, ease: 'easeOut' }}
                    className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-bg"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </motion.div>
                </div>

                {/* Content card */}
                {/* Mobile: always right of the line. Desktop: alternating left/right */}
                <div
                  className={`pl-10 md:w-1/2 md:pl-0 ${
                    isEven ? 'md:ml-auto md:pl-8' : 'md:pr-8'
                  }`}
                >
                  <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    {/* Company + period badge */}
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-text">
                        {data.company}
                      </h3>
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {data.period}
                      </span>
                    </div>

                    {/* Role */}
                    <p className="mb-3 text-sm font-medium text-text-secondary">
                      {data.role}
                    </p>

                    {/* Description */}
                    <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                      {data.description}
                    </p>

                    {/* Highlights as bullet points */}
                    <ul className="space-y-2">
                      {data.highlights.map((highlight, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={
                            isInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -10 }
                          }
                          transition={{
                            duration: 0.4,
                            delay: index * 0.2 + 0.3 + i * 0.1,
                            ease: 'easeOut',
                          }}
                          className="flex items-start gap-2.5 text-sm text-text-secondary"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                          {highlight}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}