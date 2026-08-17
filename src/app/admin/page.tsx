'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldAlert, KeyRound, LogIn } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Admin login page                                                  */
/* ------------------------------------------------------------------ */

export default function AdminLoginPage() {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — actual auth will be implemented later
  };

  return (
    <main className="flex min-h-screen items-center justify-center py-20 md:py-28">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          {/* Icon */}
          <motion.div
            variants={itemVariants}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
          >
            <Lock className="h-7 w-7 text-primary" />
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="mt-5 text-center text-2xl font-bold tracking-tight text-text"
          >
            {isZh ? '管理后台' : 'Admin Panel'}
          </motion.h1>

          {/* Subtitle / access notice */}
          <motion.div
            variants={itemVariants}
            className="mt-4 rounded-lg border border-dashed border-primary/20 bg-primary/5 px-4 py-3 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>
                {isZh
                  ? '仅限站点所有者访问'
                  : 'Only the site owner can access this area'}
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                {isZh ? '邮箱' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isZh ? '输入邮箱地址' : 'Enter your email'}
                  className="w-full rounded-xl border border-border bg-bg px-10 py-3 text-sm text-text outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Verification code */}
            <div>
              <label
                htmlFor="admin-code"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                {isZh ? '验证码' : 'Verification Code'}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  id="admin-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={
                    isZh ? '输入验证码' : 'Enter verification code'
                  }
                  className="w-full rounded-xl border border-border bg-bg px-10 py-3 text-sm text-text outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" />
              {isZh ? '登录' : 'Sign In'}
            </button>
          </motion.form>

          {/* Placeholder notice */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-xs leading-relaxed text-text-secondary/70"
          >
            {isZh
              ? '此为占位界面，实际身份验证功能将在后续实现。'
              : 'This is a placeholder UI. The actual authentication will be implemented later.'}
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}