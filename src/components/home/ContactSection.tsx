'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MessageCircle, Check, Copy, Download, ExternalLink, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig } from '@/data/site-config';

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
/*  Copyable email button                                             */
/* ------------------------------------------------------------------ */

function CopyButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [email]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Partial phone — hides middle digits                                */
/* ------------------------------------------------------------------ */

function formatPhonePartial(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length < 7) return phone;
  const visibleStart = cleaned.slice(0, 3);
  const visibleEnd = cleaned.slice(-4);
  const hidden = '*'.repeat(Math.min(cleaned.length - 7, 4));
  return `${visibleStart} ${hidden} ${visibleEnd}`;
}

/* ------------------------------------------------------------------ */
/*  Section component                                                 */
/* ------------------------------------------------------------------ */

export default function ContactSection() {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const email = siteConfig.email;
  const phone = siteConfig.phone;
  const socialLinks = siteConfig.socialLinks;

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
            {t('sections.contactDownload')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary"
          />
        </div>

        {/* Two-column layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12"
        >
          {/* ============================================================ */}
          {/*  LEFT COLUMN — Contact info                                  */}
          {/* ============================================================ */}
          <motion.div variants={cardVariants} className="space-y-6">
            {/* Email */}
            <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Mail className="h-4 w-4" />
                {t('contact.email')}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-base font-medium text-text">{email}</span>
                <CopyButton email={email} />
              </div>
            </div>

            {/* Phone */}
            {phone && (
              <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <Phone className="h-4 w-4" />
                  {t('contact.phone')}
                </div>
                <p className="mt-2 text-base font-medium text-text tracking-widest">
                  {formatPhonePartial(phone)}
                </p>
              </div>
            )}

            {/* WeChat QR placeholder */}
            <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <MessageCircle className="h-4 w-4" />
                {t('contact.wechat')}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-bg-alt text-text-secondary/50">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {language === 'zh' ? '扫码添加微信' : 'Scan to add WeChat'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/*  RIGHT COLUMN — Resume download + Social links               */}
          {/* ============================================================ */}
          <motion.div variants={cardVariants} className="space-y-6">
            {/* Resume download cards */}
            <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Download className="h-4 w-4" />
                {t('contact.resume')}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Chinese resume */}
                <a
                  href="/resume/Resume_CN.pdf"
                  download
                  className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 text-center transition-all hover:border-primary/40 hover:bg-primary/10"
                >
                  <Download className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium text-text">
                    {t('resume.downloadCn')}
                  </span>
                </a>

                {/* English resume */}
                <a
                  href="/resume/Resume_EN.pdf"
                  download
                  className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 text-center transition-all hover:border-primary/40 hover:bg-primary/10"
                >
                  <Download className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium text-text">
                    {t('resume.downloadEn')}
                  </span>
                </a>
              </div>
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <ExternalLink className="h-4 w-4" />
                  {t('contact.social')}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm font-medium text-text transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                    >
                      <Globe className="h-4 w-4 text-primary" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}