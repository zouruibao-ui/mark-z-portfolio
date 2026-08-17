'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Download,
  FileText,
  Sparkles,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { experiences, skills } from '@/data/site-config';

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const education = {
  zh: {
    school: '新闻与传播学 · 本科',
    period: '2022 — 2024',
    description: '系统学习新闻传播与品牌内容，参与多个跨平台创作项目。',
    highlights: [
      '新闻传播学基础',
      '品牌内容策划',
      '跨平台创作实践',
    ],
  },
  en: {
    school: 'Journalism & Communication · B.A.',
    period: '2022 — 2024',
    description: 'Systematic study of journalism and brand content, plus hands-on cross-platform creation projects.',
    highlights: [
      'Journalism & Communication Foundation',
      'Brand Content Planning',
      'Cross-Platform Creation',
    ],
  },
};

const languageProficiency = {
  zh: [
    { language: '中文', level: '母语 / 专业写作', stars: 5 },
    { language: '英语', level: '流利（雅思 7.5） / 双语内容创作', stars: 4 },
    { language: '日语', level: '基础阅读', stars: 2 },
  ],
  en: [
    { language: 'Chinese', level: 'Native / Professional Writing', stars: 5 },
    { language: 'English', level: 'Fluent (IELTS 7.5) / Bilingual Content', stars: 4 },
    { language: 'Japanese', level: 'Basic Reading', stars: 2 },
  ],
};

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
/*  Section with scroll-triggered entrance                            */
/* ------------------------------------------------------------------ */

function RevealSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                   */
/* ------------------------------------------------------------------ */

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-text md:text-3xl">{title}</h2>
      <div className="mt-3 h-1 w-14 rounded-full bg-primary" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline entry (work / education)                                  */
/* ------------------------------------------------------------------ */

function TimelineEntry({
  icon: Icon,
  period,
  title,
  subtitle,
  description,
  highlights,
}: {
  icon: React.ElementType;
  period: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}) {
  return (
    <div className="group relative pl-10 md:pl-12">
      {/* Node dot */}
      <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">
        {period}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm font-medium text-primary">{subtitle}</p>
      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-text-secondary">
        {description}
      </p>

      {highlights.length > 0 && (
        <ul className="mt-3 space-y-1">
          {highlights.map((h, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-text-secondary"
            >
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skill card                                                         */
/* ------------------------------------------------------------------ */

function SkillCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card border-l-4 border-l-primary/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <h3 className="text-base font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Language proficiency bar                                           */
/* ------------------------------------------------------------------ */

function LanguageBar({
  language,
  level,
  stars,
}: {
  language: string;
  level: string;
  stars: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div>
        <span className="text-sm font-medium text-text">{language}</span>
        <p className="text-xs text-text-secondary">{level}</p>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`block h-2 w-6 rounded-full transition-colors ${
              i < stars ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Download button                                                    */
/* ------------------------------------------------------------------ */

function DownloadButton({
  label,
  comingSoon,
}: {
  label: string;
  comingSoon: boolean;
}) {
  if (comingSoon) {
    return (
      <button
        disabled
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-bg-alt px-6 py-4 text-sm text-text-secondary/60 transition-colors cursor-not-allowed sm:w-auto"
      >
        <Clock className="h-5 w-5" />
        <span className="font-medium">{label}</span>
        <span className="rounded-full bg-border px-2 py-0.5 text-xs">
          Coming Soon
        </span>
      </button>
    );
  }

  return (
    <a
      href="#"
      download
      className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md sm:w-auto"
    >
      <Download className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Resume page                                                        */
/* ------------------------------------------------------------------ */

export default function ResumePage() {
  const { language, t } = useLanguage();
  const isZh = language === 'zh';

  const expList = isZh ? experiences.map((e) => e.zh) : experiences.map((e) => e.en);
  const edu = isZh ? education.zh : education.en;
  const skillList = isZh ? skills.map((s) => s.zh) : skills.map((s) => s.en);
  const langs = isZh ? languageProficiency.zh : languageProficiency.en;

  return (
    <main className="min-h-screen py-20 md:py-28">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8">
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
            {isZh ? 'Mark Z · 简历' : 'Mark Z · Resume'}
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="mt-4 text-4xl font-bold tracking-tight text-text md:text-5xl"
          >
            {t('resume.title')}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-5 max-w-xl text-responsive text-text-secondary"
          >
            {isZh
              ? '品牌内容策略 · 国际传播 · AI 创意实践'
              : 'Brand Content Strategy · Global Communication · AI Creative Practice'}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-6 h-1 w-16 rounded-full bg-primary"
          />
        </motion.div>

        {/* ========================================================== */}
        {/*  Download buttons                                          */}
        {/* ========================================================== */}
        <RevealSection>
          <div className="mb-14 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-text">
                {isZh ? '下载简历' : 'Download Resume'}
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <DownloadButton
                label={t('resume.downloadCn')}
                comingSoon
              />
              <DownloadButton
                label={t('resume.downloadEn')}
                comingSoon
              />
            </div>
            <p className="mt-3 text-xs text-text-secondary">
              {isZh
                ? 'PDF 简历即将上线，敬请期待。'
                : 'PDF version coming soon. Stay tuned.'}
            </p>
          </div>
        </RevealSection>

        {/* ========================================================== */}
        {/*  Online Version — Work Experience                          */}
        {/* ========================================================== */}
        <section className="mb-14">
          <RevealSection>
            <SectionHeading
              title={isZh ? '工作经历' : 'Work Experience'}
            />

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[13px] top-2 bottom-2 w-px bg-border md:left-0" />

              <div className="space-y-10">
                {expList.map((exp, idx) => (
                  <RevealSection key={idx}>
                    <TimelineEntry
                      icon={Briefcase}
                      period={exp.period}
                      title={exp.company}
                      subtitle={exp.role}
                      description={exp.description}
                      highlights={exp.highlights}
                    />
                  </RevealSection>
                ))}
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ========================================================== */}
        {/*  Education                                                  */}
        {/* ========================================================== */}
        <section className="mb-14">
          <RevealSection>
            <SectionHeading
              title={isZh ? '教育背景' : 'Education'}
            />

            <div className="relative">
              <div className="absolute left-[13px] top-2 bottom-2 w-px bg-border md:left-0" />

              <div className="space-y-10">
                <RevealSection>
                  <TimelineEntry
                    icon={GraduationCap}
                    period={edu.period}
                    title={edu.school}
                    subtitle=""
                    description={edu.description}
                    highlights={edu.highlights}
                  />
                </RevealSection>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ========================================================== */}
        {/*  Skills                                                     */}
        {/* ========================================================== */}
        <section className="mb-14">
          <RevealSection>
            <SectionHeading
              title={isZh ? '核心能力' : 'Core Skills'}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {skillList.map((skill, idx) => (
                <RevealSection key={idx}>
                  <SkillCard
                    title={skill.title}
                    description={skill.desc}
                  />
                </RevealSection>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* ========================================================== */}
        {/*  Language Proficiency                                       */}
        {/* ========================================================== */}
        <section className="mb-14">
          <RevealSection>
            <SectionHeading
              title={isZh ? '语言能力' : 'Languages'}
            />

            <div className="rounded-xl border border-border bg-card p-6">
              {langs.map((lang, idx) => (
                <LanguageBar
                  key={idx}
                  language={lang.language}
                  level={lang.level}
                  stars={lang.stars}
                />
              ))}
            </div>
          </RevealSection>
        </section>

        {/* ========================================================== */}
        {/*  Keyword tags — bottom summary                             */}
        {/* ========================================================== */}
        <RevealSection>
          <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-border bg-card p-6">
            <Sparkles className="mr-1 h-4 w-4 text-primary" />
            {(isZh
              ? ['品牌定位', '内容策略', '双语内容', '海外社媒', 'AI 工作流', '短视频', 'IP 孵化', '数据分析']
              : ['Brand Strategy', 'Content Strategy', 'Bilingual Content', 'Global Social', 'AI Workflow', 'Short Video', 'IP Incubation', 'Data Analysis']
            ).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-bg-alt px-3 py-1.5 text-xs font-medium text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </RevealSection>
      </div>
    </main>
  );
}