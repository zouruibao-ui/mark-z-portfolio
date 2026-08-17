'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center py-24">
      <div className="mx-auto w-full max-w-lg px-4 text-center">
        <span className="select-none text-8xl font-bold text-border/50">404</span>
        <h1 className="mt-4 text-2xl font-bold text-text">
          {language === 'zh' ? '页面未找到' : 'Page Not Found'}
        </h1>
        <p className="mt-2 text-text-secondary">
          {language === 'zh'
            ? '您访问的页面不存在或已被移动。'
            : 'The page you are looking for does not exist or has been moved.'}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark"
        >
          {language === 'zh' ? '返回首页' : 'Back to Home'}
        </Link>
      </div>
    </main>
  );
}