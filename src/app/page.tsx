'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import FeaturedWorks from '@/components/home/FeaturedWorks';
import SkillsSection from '@/components/home/SkillsSection';
import EvidenceSection from '@/components/home/EvidenceSection';
import ExperienceSection from '@/components/home/ExperienceSection';
import AboutSummary from '@/components/home/AboutSummary';
import ContactSection from '@/components/home/ContactSection';

/* ------------------------------------------------------------------ */
/*  Section entrance animation — fade in + slide up on scroll         */
/* ------------------------------------------------------------------ */

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Home page                                                         */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <HeroSection />
      <AnimatedSection>
        <FeaturedWorks />
      </AnimatedSection>
      <AnimatedSection>
        <SkillsSection />
      </AnimatedSection>
      <AnimatedSection>
        <EvidenceSection />
      </AnimatedSection>
      <AnimatedSection>
        <ExperienceSection />
      </AnimatedSection>
      <AnimatedSection>
        <AboutSummary />
      </AnimatedSection>
      <AnimatedSection>
        <ContactSection />
      </AnimatedSection>
    </>
  );
}