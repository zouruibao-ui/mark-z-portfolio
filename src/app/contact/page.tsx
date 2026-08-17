'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Download,
  ExternalLink,
  Globe,
  Eye,
  EyeOff,
  Lock,
  Send,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig } from '@/data/site-config';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/* Masks the middle digits of a phone number: 138****8000 */
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
/*  Copyable email button                                             */
/* ------------------------------------------------------------------ */

function CopyEmailButton({ email }: { email: string }) {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      /* Clipboard API unavailable — fallback for older browsers */
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={isZh ? '复制邮箱' : 'Copy email'}
      className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          {isZh ? '已复制' : 'Copied'}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {isZh ? '复制' : 'Copy'}
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact page                                                      */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  const { language, t } = useLanguage();
  const isZh = language === 'zh';
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const email = siteConfig.email;
  const phone = siteConfig.phone;

  return (
    <main className="min-h-screen py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8">
        {/* ========================================================== */}
        {/*  Page header                                               */}
        {/* ========================================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 text-center md:mb-16"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-text-secondary"
          >
            {isZh ? 'Mark Z · 联系' : 'Mark Z · Contact'}
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="mt-4 text-4xl font-bold tracking-tight text-text md:text-5xl"
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-5 max-w-xl text-responsive text-text-secondary"
          >
            {isZh
              ? '合作、交流，或聊聊品牌与 AI 创意的可能 —— 欢迎随时联系。'
              : 'For collaborations, conversations, or ideas around brand and AI creative — do not hesitate to reach out.'}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-6 h-1 w-16 rounded-full bg-primary"
          />
        </motion.div>

        {/* ========================================================== */}
        {/*  Contact method cards                                       */}
        {/* ========================================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* ---------------- LEFT COLUMN — direct contact ---------------- */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Email */}
            <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Mail className="h-4 w-4" />
                {t('contact.email')}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`mailto:${email}`}
                  className="text-base font-medium text-text transition-colors hover:text-primary"
                >
                  {email}
                </a>
                <CopyEmailButton email={email} />
              </div>
            </div>

            {/* Phone — partially hidden until clicked */}
            {phone && (
              <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <Phone className="h-4 w-4" />
                  {t('contact.phone')}
                </div>
                <button
                  type="button"
                  onClick={() => setPhoneRevealed((v) => !v)}
                  aria-pressed={phoneRevealed}
                  className="mt-2 flex w-full flex-wrap items-center justify-between gap-3 text-left"
                >
                  <span className="text-base font-medium tracking-widest text-text">
                    {phoneRevealed ? phone : formatPhonePartial(phone)}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
                    {phoneRevealed ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        {isZh ? '隐藏' : 'Hide'}
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        {isZh ? '点击显示' : 'Reveal'}
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}

            {/* WeChat QR placeholder */}
            {/* Real image lives at siteConfig.wechatQr — swap the dashed box when available. */}
            <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <MessageCircle className="h-4 w-4" />
                {t('contact.wechat')}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-bg-alt text-text-secondary/50">
                  <MessageCircle className="h-9 w-9" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">
                    {isZh ? '微信二维码' : 'WeChat QR Code'}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {isZh
                      ? '扫码添加微信，通过好友验证后即可沟通。'
                      : 'Scan to connect on WeChat after the friend request is accepted.'}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary/70">
                    {isZh
                      ? '二维码占位 —— 后续替换为真实图片。'
                      : 'QR placeholder — swap in the real image later.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---------------- RIGHT COLUMN — resume & social ---------------- */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Resume downloads */}
            <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Download className="h-4 w-4" />
                {t('contact.resume')}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href="/resume/Resume_CN.pdf"
                  download
                  className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 text-center transition-all hover:border-primary/40 hover:bg-primary/10"
                >
                  <FileText className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium text-text">
                    {t('resume.downloadCn')}
                  </span>
                </a>
                <a
                  href="/resume/Resume_EN.pdf"
                  download
                  className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 text-center transition-all hover:border-primary/40 hover:bg-primary/10"
                >
                  <FileText className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium text-text">
                    {t('resume.downloadEn')}
                  </span>
                </a>
              </div>
              <p className="mt-3 text-xs text-text-secondary">
                {isZh
                  ? 'PDF 简历 —— 中文版 / 英文版。'
                  : 'Resume PDFs — Chinese / English.'}
              </p>
            </div>

            {/* Social media */}
            {siteConfig.socialLinks.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <ExternalLink className="h-4 w-4" />
                  {t('contact.social')}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {siteConfig.socialLinks.map((link) => (
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

        {/* ========================================================== */}
        {/*  Message form — disabled / closed by default (PRD)         */}
        {/* ========================================================== */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 rounded-2xl border border-border bg-card p-6 md:p-10"
        >
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text md:text-xl">
                  {t('contact.formTitle')}
                </h2>
                <p className="text-xs text-text-secondary">
                  {isZh ? '请优先使用邮箱或微信' : 'Prefer email or WeChat'}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-alt px-3 py-1 text-xs font-medium text-text-secondary">
              <Lock className="h-3.5 w-3.5" />
              {isZh ? '表单暂未开放' : 'Form currently disabled'}
            </span>
          </div>

          {/* Disabled form fields */}
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                disabled
                placeholder={isZh ? '您的称呼' : 'Your name'}
                className="w-full cursor-not-allowed rounded-xl border border-dashed border-border bg-bg-alt px-4 py-3 text-sm text-text/50 outline-none placeholder:text-text-secondary/60"
              />
              <input
                type="email"
                disabled
                placeholder={isZh ? '您的邮箱' : 'Your email'}
                className="w-full cursor-not-allowed rounded-xl border border-dashed border-border bg-bg-alt px-4 py-3 text-sm text-text/50 outline-none placeholder:text-text-secondary/60"
              />
            </div>
            <textarea
              disabled
              rows={4}
              placeholder={t('contact.formPlaceholder')}
              className="w-full cursor-not-allowed resize-none rounded-xl border border-dashed border-border bg-bg-alt px-4 py-3 text-sm text-text/50 outline-none placeholder:text-text-secondary/60"
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-text-secondary">
                {isZh
                  ? '按产品规划，站内直接留言暂不开放。'
                  : 'Per the product plan, on-site direct messaging is not open yet.'}
              </p>
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-primary/40 px-6 py-2.5 text-sm font-medium text-white/70"
              >
                <Send className="h-4 w-4" />
                {isZh ? '发送' : 'Send'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}