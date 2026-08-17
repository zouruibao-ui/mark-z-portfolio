'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig } from '@/data/site-config';

const decorativeCards = [
  { color: 'bg-primary/10', border: 'border-primary/20', delay: 0, x: -60, y: -50, w: 56, h: 40 },
  { color: 'bg-accent/10', border: 'border-accent/20', delay: 0.6, x: 40, y: -10, w: 44, h: 32 },
  { color: 'bg-primary/5', border: 'border-primary/10', delay: 1.2, x: -10, y: 50, w: 48, h: 28 },
];

export default function HeroSection() {
  const { language, t } = useLanguage();

  const subtitle = t('hero.subtitle');
  const ctaWorks = t('hero.cta_works');
  const ctaResume = t('hero.cta_resume');
  const jobStatus = siteConfig.jobStatus[language];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 50%, rgba(16,185,129,0.06) 100%)',
          backgroundSize: '400% 400%',
          backgroundPosition: '0% 50%',
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.05) 0%, transparent 50%)',
        }}
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Job status badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="inline-block px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary font-medium mb-6">
                {jobStatus}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="font-bold text-5xl md:text-7xl text-text mb-4 tracking-tight"
            >
              {siteConfig.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="text-xl md:text-2xl text-text-secondary mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {subtitle}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/works"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary text-white font-medium text-base hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
              >
                {ctaWorks}
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-primary text-primary font-medium text-base hover:bg-primary/5 transition-colors"
              >
                {ctaResume}
              </Link>
            </motion.div>
          </div>

          {/* Right: Decorative floating cards (desktop only) */}
          <div className="hidden lg:block flex-1 relative h-[400px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {decorativeCards.map((card, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-2xl ${card.color} ${card.border} border`}
                  style={{ width: card.w, height: card.h }}
                  initial={{ opacity: 0, scale: 0.8, x: card.x, y: card.y }}
                  animate={{
                    opacity: [0.5, 0.85, 0.5],
                    y: [card.y, card.y - 10, card.y],
                  }}
                  transition={{
                    opacity: {
                      duration: 4,
                      delay: card.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    y: {
                      duration: 5,
                      delay: card.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}