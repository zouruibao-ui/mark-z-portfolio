'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Code, ArrowUp, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { language, t } = useLanguage();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-sm text-text-secondary text-center md:text-left">
          {t('footer.copyright')} {year}. {t('footer.allRights')}
        </p>

        {/* Language notice */}
        <p className="text-sm text-text-secondary flex items-center gap-1.5">
          <Globe size={14} />
          {language === 'zh' ? '中 | EN' : 'EN | 中文'}
        </p>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <a
            href="https://linkedin.com/in/mark-z"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <ExternalLink size={18} />
          </a>
          <a
            href="https://github.com/mark-z"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <Code size={18} />
          </a>
          <a
            href="https://x.com/mark_z"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors"
            aria-label="X (Twitter)"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all duration-300 ${
          showBackToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}