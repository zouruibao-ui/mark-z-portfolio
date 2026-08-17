'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const navItems = [
  { href: '/works', tKey: 'nav.works' },
  { href: '/about', tKey: 'nav.about' },
  { href: '/resume', tKey: 'nav.resume' },
  { href: '/contact', tKey: 'nav.contact' },
];

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  }, [language, setLanguage]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/25">
      <div className="w-full px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-text hover:text-primary transition-colors"
        >
          Mark Z
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {t(item.tKey)}
            </Link>
          ))}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text transition-colors ml-2"
            aria-label={`Switch language to ${language === 'zh' ? 'English' : '中文'}`}
          >
            <Globe size={16} />
            <span>{language === 'zh' ? 'EN' : '中文'}</span>
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden flex items-center justify-center text-text hover:text-primary transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Close button */}
        <div className="w-full px-4 py-3 flex items-center justify-end">
          <button
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center text-text hover:text-primary transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile nav links */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-2xl font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {t(item.tKey)}
            </Link>
          ))}

          {/* Language Toggle in Mobile */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-lg font-medium text-text-secondary hover:text-text transition-colors mt-4"
            aria-label={`Switch language to ${language === 'zh' ? 'English' : '中文'}`}
          >
            <Globe size={20} />
            <span>{language === 'zh' ? 'EN' : '中文'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}