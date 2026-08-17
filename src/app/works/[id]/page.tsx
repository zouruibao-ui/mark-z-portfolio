'use client';

import { use, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronLeft, ExternalLink, Users, Film, TrendingUp, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { works } from '@/data/works';
import { siteConfig } from '@/data/site-config';
import { STATUS_COLORS, CATEGORY_EMOJI } from '@/lib/constants';
import type { WorkItem, WorkEvidence } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Status colour & category emoji (from shared constants)            */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                   */
/* ------------------------------------------------------------------ */

function Section({
  id,
  title,
  children,
  className = '',
}: {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={`py-10 md:py-14 ${className}`}
    >
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text md:text-3xl">{title}</h2>
          <div className="mt-3 h-0.5 w-12 rounded-full bg-primary" />
        </div>
      )}
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Evidence badge                                                    */
/* ------------------------------------------------------------------ */

function EvidenceBadge({ evidence }: { evidence: WorkEvidence }) {
  const { language } = useLanguage();
  const icon = evidence.type === 'certificate' ? '🏆' : evidence.type === 'link' ? '🔗' : evidence.type === 'screenshot' ? '📷' : '📊';
  return (
    <a
      href={evidence.url || '#'}
      target={evidence.url ? '_blank' : undefined}
      rel={evidence.url ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <span className="text-lg">{icon}</span>
      <div>
        <p className="font-medium text-text">{evidence.label}</p>
        {evidence.description && (
          <p className="text-xs text-text-secondary">{evidence.description}</p>
        )}
      </div>
      {evidence.url && <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-text-secondary" />}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Navigation arrows                                                 */
/* ------------------------------------------------------------------ */

function PrevNextNav({ current, prev, next }: { current: WorkItem; prev?: WorkItem; next?: WorkItem }) {
  const { language } = useLanguage();
  return (
    <nav className="flex items-center justify-between gap-4 border-t border-border pt-8">
      <div>
        {prev ? (
          <Link
            href={`/works/${prev.id}`}
            className="group flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <div className="text-left">
              <p className="text-xs text-text-secondary/60">{language === 'zh' ? '上一篇' : 'Previous'}</p>
              <p className="max-w-[200px] truncate font-medium text-text">{prev.title[language]}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
      <div>
        {next ? (
          <Link
            href={`/works/${next.id}`}
            className="group flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <div className="text-right">
              <p className="text-xs text-text-secondary/60">{language === 'zh' ? '下一篇' : 'Next'}</p>
              <p className="max-w-[200px] truncate font-medium text-text">{next.title[language]}</p>
            </div>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Section                                                       */
/* ------------------------------------------------------------------ */

function ContactCTA() {
  const { language } = useLanguage();
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="mt-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-primary/10 p-8 text-center md:p-12"
    >
      <h2 className="text-2xl font-bold text-text md:text-3xl">
        {language === 'zh' ? '对这个项目感兴趣？' : 'Interested in this project?'}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-text-secondary">
        {language === 'zh'
          ? '如果你对我的作品感兴趣，或者有合作想法，欢迎联系我。'
          : 'If you are interested in my work or have collaboration ideas, feel free to reach out.'}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`mailto:${siteConfig.email}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark"
        >
          <MessageCircle className="h-4 w-4" />
          {language === 'zh' ? '发送邮件' : 'Send Email'}
        </Link>
        <Link
          href="/works"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-text transition-all hover:border-primary/30 hover:shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回作品列表' : 'Back to Works'}
        </Link>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail content per work                                           */
/* ------------------------------------------------------------------ */

function WorkDetailContent({ work }: { work: WorkItem }) {
  const { language, t } = useLanguage();
  const categoryName = t(`categories.${work.category}.name`);
  const statusName = t(`status.${work.status}.name`);
  const statusColor = STATUS_COLORS[work.status];

  /* Find prev/next */
  const currentIndex = works.findIndex((w) => w.id === work.id);
  const prev = currentIndex > 0 ? works[currentIndex - 1] : undefined;
  const next = currentIndex < works.length - 1 ? works[currentIndex + 1] : undefined;

  /* Compute related works */
  const relatedWorks = useMemo(() => {
    if (work.relatedIds && work.relatedIds.length > 0) {
      return works.filter((w) => work.relatedIds.includes(w.id));
    }
    /* Fallback: same category, exclude self */
    return works.filter((w) => w.id !== work.id && w.category === work.category).slice(0, 3);
  }, [work]);

  /* ---- Work-specific content ---- */

  const isPhoenix = work.id === 'phoenix-media';
  const isQige = work.id === 'qige-ai-system';
  const isCollegeAward = work.id === 'college-award';
  const isAiMicroFilm = work.id === 'ai-micro-film';
  const isSpringFarming = work.id === 'spring-farming';

  return (
    <main className="min-h-screen py-20 md:py-28">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8">
        {/* ============================================================ */}
        {/*  Back link                                                   */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-6"
        >
          <Link
            href="/works"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('work.backToList')}
          </Link>
        </motion.div>

        {/* ============================================================ */}
        {/*  Hero area                                                   */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Cover image */}
          <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-bg-alt">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
              <span className="select-none text-7xl opacity-20">{CATEGORY_EMOJI[work.category]}</span>
            </div>
            {/* Status badge */}
            <span
              className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-sm font-medium ${statusColor}`}
            >
              {statusName}
            </span>
          </div>

          {/* Title + meta */}
          <h1 className="text-3xl font-bold text-text md:text-4xl lg:text-5xl">
            {work.title[language]}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
            {/* Category */}
            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-medium text-primary">
              {categoryName}
            </span>
            {/* Year */}
            <span>{work.year}</span>
            {/* Organization */}
            {work.organization && (
              <span>{work.organization[language]}</span>
            )}
          </div>

          {/* Role */}
          {work.role && (
            <p className="mt-3 text-base text-text-secondary">
              <span className="font-medium text-text">{language === 'zh' ? '角色' : 'Role'}:</span>{' '}
              {work.role[language]}
            </p>
          )}
        </motion.div>

        {/* ============================================================ */}
        {/*  30-Second Summary                                           */}
        {/* ============================================================ */}
        <Section title={language === 'zh' ? '30秒摘要' : '30-Second Summary'}>
          <p className="text-responsive leading-relaxed text-text-secondary">
            {work.summary[language]}
          </p>

          {/* College Award: team contribution note */}
          {isCollegeAward && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">
                  {language === 'zh' ? '团队作品' : 'Team Work'}
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  {language === 'zh'
                    ? '本作品为团队合作完成，个人贡献为前期策划与部分拍摄。'
                    : 'This is a team project. Individual contribution: pre-production planning and partial filming.'}
                </p>
              </div>
            </div>
          )}

          {/* AI Micro Film: pending results note */}
          {isAiMicroFilm && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <Film className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">
                  {language === 'zh' ? '参赛中' : 'In Competition'}
                </p>
                <p className="mt-1 text-sm text-blue-700">
                  {language === 'zh'
                    ? '该作品目前正在参赛中，结果待公布。'
                    : 'This work is currently in competition. Results are pending.'}
                </p>
              </div>
            </div>
          )}
        </Section>

        {/* ============================================================ */}
        {/*  Project Background                                          */}
        {/* ============================================================ */}
        <Section title={language === 'zh' ? '项目背景' : 'Project Background'}>
          {isPhoenix && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                在凤凰网从事融媒体内容策划、采编与短视频制作，深度参与新闻内容的融媒化转型。
              </p>
              <p className="text-sm text-text-secondary/70">
                At Phoenix News, I was responsible for converged media content planning, reporting, and short video production, deeply involved in the media convergence transformation of news content.
              </p>
            </div>
          )}
          {isQige && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                旗哥AI短视频内容协作系统是一个从灵感孵化、选题脚本、剪辑发布到数据复盘的AI驱动内容生产系统，旨在提升短视频内容生产效率与质量。
              </p>
              <p className="text-sm text-text-secondary/70">
                Qige AI Short Video Content System is an AI-driven content production system covering inspiration incubation, topic scripting, editing/publishing, and data review. It aims to improve short video content production efficiency and quality.
              </p>
            </div>
          )}
          {isCollegeAward && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                参与2025秋季学院奖（华润江中命题），创作微电影《大鱼大肉的肠道消化赛》，获微电影类别优秀奖。作品以生动有趣的叙事方式，传递肠道健康理念。
              </p>
              <p className="text-sm text-text-secondary/70">
                Participated in the 2025 Fall College Award (commissioned by China Resources Jiangzhong), creating the micro film &quot;Intestinal Digestion Race of Big Fish and Big Meat.&quot; Won the Excellence Award in the Micro Film category. The work conveys gut health concepts through vivid and engaging storytelling.
              </p>
            </div>
          )}
          {isAiMicroFilm && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                《麦田里的青砖》是一部完全使用AI工具制作的微电影，探索AI在视频创作中的可能性。从策划、脚本到AI分镜、视频生成与剪辑，全流程由个人独立完成。
              </p>
              <p className="text-sm text-text-secondary/70">
                &quot;Green Brick in the Wheat Field&quot; is a micro film entirely created with AI tools, exploring the possibilities of AI in video creation. From planning and script to AI storyboard, video generation, and editing, the entire pipeline was completed independently.
              </p>
            </div>
          )}
          {isSpringFarming && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                参与春播杯直播助农活动，负责直播策划、商品推广与内容执行，通过直播形式助力农产品推广。
              </p>
              <p className="text-sm text-text-secondary/70">
                Participated in the Spring Farming Cup live streaming for agricultural support, responsible for live planning, product promotion, and content execution, helping promote agricultural products through live streaming.
              </p>
            </div>
          )}
        </Section>

        {/* ============================================================ */}
        {/*  Strategy & Contribution                                     */}
        {/* ============================================================ */}
        <Section title={language === 'zh' ? '策略与贡献' : 'Strategy & Contribution'}>
          {isPhoenix && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                核心案例 + 多作品模式：以具有代表性的融媒体报道为核心，辅以多篇不同风格的短视频作品，展示融媒体内容策划与采编的综合能力。
              </p>
              <p className="text-sm text-text-secondary/70">
                Core case + multiple works pattern: A representative converged media report as the centerpiece, complemented by multiple short video works of different styles, demonstrating comprehensive capabilities in converged media content planning and reporting.
              </p>
            </div>
          )}
          {isQige && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                从零搭建AI短视频内容协作系统，设计并实现以下四个核心模块：
              </p>
              {/* Qige 4 modules */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: '💡',
                    title: language === 'zh' ? '灵感孵化' : 'Inspiration Incubation',
                    desc: language === 'zh'
                      ? '热点追踪、选题挖掘、灵感沉淀'
                      : 'Trend tracking, topic mining, inspiration gathering',
                  },
                  {
                    icon: '📝',
                    title: language === 'zh' ? '选题脚本' : 'Topic Scripting',
                    desc: language === 'zh'
                      ? 'AI辅助脚本生成、大纲优化、内容结构化'
                      : 'AI-assisted script generation, outline optimization, content structuring',
                  },
                  {
                    icon: '🎬',
                    title: language === 'zh' ? '剪辑发布' : 'Editing & Publishing',
                    desc: language === 'zh'
                      ? '自动化剪辑工作流、多平台分发'
                      : 'Automated editing workflow, multi-platform distribution',
                  },
                  {
                    icon: '📊',
                    title: language === 'zh' ? '数据复盘' : 'Data Review',
                    desc: language === 'zh'
                      ? '效果追踪、数据分析、策略迭代'
                      : 'Performance tracking, data analysis, strategy iteration',
                  },
                ].map((module) => (
                  <div
                    key={module.title}
                    className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
                  >
                    <span className="text-3xl">{module.icon}</span>
                    <h3 className="mt-3 font-semibold text-text">{module.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{module.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isCollegeAward && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                在团队中承担前期策划与部分拍摄工作，与团队成员协作完成微电影的创意构思、脚本撰写和拍摄执行。
              </p>
              <p className="text-sm text-text-secondary/70">
                Took on pre-production planning and partial filming within the team, collaborating with team members on creative concept development, script writing, and filming execution.
              </p>
            </div>
          )}
          {isAiMicroFilm && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                全流程独立完成，探索AI视频生成工具（即梦Seedance、ChatGPT、剪映）在微电影创作中的应用，验证AI视频创作工作流的可行性。
              </p>
              <p className="text-sm text-text-secondary/70">
                Completed the entire pipeline independently, exploring the application of AI video generation tools (Jimeng Seedance, ChatGPT, Jianying) in micro film creation, validating the feasibility of an AI video creation workflow.
              </p>
            </div>
          )}
          {isSpringFarming && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                负责直播策划与执行，包括商品选品、直播脚本设计、现场执行与互动管理，通过直播形式提升农产品曝光与销量。
              </p>
              <p className="text-sm text-text-secondary/70">
                Responsible for live streaming planning and execution, including product selection, live script design, on-site execution, and interaction management, boosting agricultural product exposure and sales through live streaming.
              </p>
            </div>
          )}
        </Section>

        {/* ============================================================ */}
        {/*  Process & Deliverables                                      */}
        {/* ============================================================ */}
        <Section title={language === 'zh' ? '流程与交付物' : 'Process & Deliverables'}>
          {isQige && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                系统搭建流程：需求调研 → 系统架构设计 → 模块开发与集成 → 测试与优化 → 运营与迭代。
              </p>
              <p className="text-sm text-text-secondary/70">
                System build process: Requirements research → System architecture design → Module development & integration → Testing & optimization → Operations & iteration.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  language === 'zh' ? '交付物：AI内容协作系统（含四个核心模块）' : 'Deliverable: AI Content Collaboration System (4 core modules)',
                  language === 'zh' ? '持续产出短视频内容，保持稳定更新频率' : 'Continuous short video content output at stable update frequency',
                  language === 'zh' ? '提供内容生产流程文档与SOP' : 'Content production workflow documentation and SOP',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isPhoenix && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                工作流程：选题策划 → 采访与素材采集 → 融媒体报道撰写 → 短视频制作与剪辑 → 多平台发布与传播。
              </p>
              <p className="text-sm text-text-secondary/70">
                Workflow: Topic planning → Interview & material collection → Converged media report writing → Short video production & editing → Multi-platform release & distribution.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  language === 'zh' ? '交付物：多篇融媒体报道与短视频作品' : 'Deliverable: Multiple converged media reports and short videos',
                  language === 'zh' ? '涵盖新闻采访、专题策划、短视频制作等多种形式' : 'Covering news interviews, feature planning, short video production, and more',
                  language === 'zh' ? '在凤凰网平台及社交媒体渠道发布' : 'Published on Phoenix News platform and social media channels',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isCollegeAward && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                流程：命题分析 → 创意构思 → 脚本创作 → 拍摄执行 → 后期剪辑 → 提交参赛。
              </p>
              <p className="text-sm text-text-secondary/70">
                Process: Brief analysis → Creative concept → Script writing → Filming → Post-production → Submission.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  language === 'zh' ? '交付物：微电影《大鱼大肉的肠道消化赛》' : 'Deliverable: Micro film "Intestinal Digestion Race of Big Fish and Big Meat"',
                  language === 'zh' ? '获得2025秋季学院奖微电影类别优秀奖' : 'Awarded 2025 Fall College Award Excellence Award in Micro Film category',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isAiMicroFilm && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                流程：故事策划 → AI分镜图生成 → AI视频生成（即梦Seedance）→ 剪辑与后期（剪映）→ 音效与配乐 → 输出成片。
              </p>
              <p className="text-sm text-text-secondary/70">
                Process: Story planning → AI storyboard generation → AI video generation (Jimeng Seedance) → Editing & post-production (Jianying) → Sound & music → Final output.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  language === 'zh' ? '交付物：AI微电影《麦田里的青砖》' : 'Deliverable: AI Micro Film "Green Brick in the Wheat Field"',
                  language === 'zh' ? '已验证AI视频创作全流程工作流' : 'Validated end-to-end AI video creation workflow',
                  language === 'zh' ? '参赛中 · 结果待公布' : 'In competition · Pending results',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isSpringFarming && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                流程：直播策划 → 商品选品 → 脚本设计 → 直播执行 → 效果复盘。
              </p>
              <p className="text-sm text-text-secondary/70">
                Process: Live streaming planning → Product selection → Script design → Live execution → Performance review.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  language === 'zh' ? '交付物：直播助农活动（含策划方案与执行）' : 'Deliverable: Agricultural live streaming event (planning & execution)',
                  language === 'zh' ? '成功完成直播活动，助力农产品推广' : 'Successfully completed live streaming, boosting agricultural product promotion',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* ============================================================ */}
        {/*  Final work (placeholder for video/image)                    */}
        {/* ============================================================ */}
        <Section title={language === 'zh' ? '最终作品' : 'Final Work'}>
          <div className="flex aspect-video items-center justify-center rounded-2xl border-2 border-dashed border-border bg-bg-alt">
            <div className="text-center">
              <span className="select-none text-5xl opacity-30">{CATEGORY_EMOJI[work.category]}</span>
              <p className="mt-3 text-sm text-text-secondary/50">
                {language === 'zh' ? '作品展示区域（视频/图片待补充）' : 'Work display area (video/image to be added)'}
              </p>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  Results & Evidence                                          */}
        {/* ============================================================ */}
        <Section title={language === 'zh' ? '成果与证据' : 'Results & Evidence'}>
          {/* Results description */}
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-800">
                {language === 'zh' ? '成果' : 'Results'}
              </p>
              <p className="mt-1 text-sm text-emerald-700">{work.results[language]}</p>
            </div>
          </div>

          {/* Evidence items */}
          {work.evidence && work.evidence.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-text">
                {language === 'zh' ? '证据材料' : 'Evidence'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {work.evidence
                  .filter((e) => e.isPublic)
                  .map((e, i) => (
                    <EvidenceBadge key={i} evidence={e} />
                  ))}
              </div>
            </div>
          )}

          {/* No evidence placeholder */}
          {(!work.evidence || work.evidence.length === 0) && (
            <p className="text-sm italic text-text-secondary/50">
              {language === 'zh' ? '暂无证据材料' : 'No evidence available yet'}
            </p>
          )}
        </Section>

        {/* ============================================================ */}
        {/*  Reflection (optional)                                       */}
        {/* ============================================================ */}
        <Section title={language === 'zh' ? '反思与总结' : 'Reflection'}>
          {isQige && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                从0到1搭建AI内容协作系统，深刻理解了AI工具在内容生产中的实际价值与局限。系统化思维和数据驱动是提升内容效率的关键。
              </p>
              <p className="text-sm text-text-secondary/70">
                Building an AI content collaboration system from scratch gave me deep insight into the practical value and limitations of AI tools in content production. Systematic thinking and data-driven approaches are key to improving content efficiency.
              </p>
            </div>
          )}
          {isPhoenix && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                融媒体实践中，深刻体会到"核心案例+多作品"模式在展示综合能力方面的有效性。高质量的深度报道与多样化的短视频内容形成互补，共同构建专业形象。
              </p>
              <p className="text-sm text-text-secondary/70">
                In converged media practice, I deeply felt the effectiveness of the &quot;core case + multiple works&quot; model in showcasing comprehensive capabilities. High-quality in-depth reports and diverse short video content complement each other, building a professional profile together.
              </p>
            </div>
          )}
          {isCollegeAward && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                团队协作中，前期的充分策划是项目成功的基础。清晰的创意方向与分工协作，使团队能够在有限时间内高质量完成作品。
              </p>
              <p className="text-sm text-text-secondary/70">
                In team collaboration, thorough pre-production planning is the foundation of project success. Clear creative direction and division of labor enabled the team to deliver high-quality work within a limited timeframe.
              </p>
            </div>
          )}
          {isAiMicroFilm && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                AI视频生成技术正在快速发展，但在叙事连贯性、角色一致性等方面仍有明显局限。这次实践验证了AI创作工作流的可行性，也明确了当前技术边界。
              </p>
              <p className="text-sm text-text-secondary/70">
                AI video generation technology is evolving rapidly, but still has clear limitations in narrative coherence, character consistency, etc. This practice validated the feasibility of an AI creative workflow while also clarifying the current technological boundaries.
              </p>
            </div>
          )}
          {isSpringFarming && (
            <div className="space-y-4 text-responsive leading-relaxed text-text-secondary">
              <p>
                直播助农融合了电商与公益，在策划与执行中需要兼顾商品推广效果与助农初心。规范化流程与灵活应变能力缺一不可。
              </p>
              <p className="text-sm text-text-secondary/70">
                Agricultural live streaming combines e-commerce and public welfare. Planning and execution require balancing product promotion effectiveness with the original intention of supporting farmers. Standardized processes and adaptability are equally important.
              </p>
            </div>
          )}
        </Section>

        {/* ============================================================ */}
        {/*  Related Works                                               */}
        {/* ============================================================ */}
        {relatedWorks.length > 0 && (
          <Section title={t('work.relatedWorks')}>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {relatedWorks.map((rw) => {
                const rwCategoryName = t(`categories.${rw.category}.name`);
                const rwStatusColor = STATUS_COLORS[rw.status];
                const rwStatusName = t(`status.${rw.status}.name`);
                return (
                  <motion.div key={rw.id} variants={fadeUp}>
                    <Link
                      href={`/works/${rw.id}`}
                      className="group block rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-bg-alt">
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 transition-transform duration-500 group-hover:scale-105">
                          <span className="select-none text-3xl opacity-30">
                            {CATEGORY_EMOJI[rw.category]}
                          </span>
                        </div>
                        <span
                          className={`absolute right-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-medium ${rwStatusColor}`}
                        >
                          {rwStatusName}
                        </span>
                      </div>
                      <div className="p-3">
                        <div className="mb-1 flex items-center gap-1.5">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            {rwCategoryName}
                          </span>
                          <span className="text-[10px] text-text-secondary">{rw.year}</span>
                        </div>
                        <h4 className="line-clamp-2 text-sm font-medium text-text transition-colors group-hover:text-primary">
                          {rw.title[language]}
                        </h4>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </Section>
        )}

        {/* ============================================================ */}
        {/*  Previous / Next Navigation                                  */}
        {/* ============================================================ */}
        <PrevNextNav current={work} prev={prev} next={next} />

        {/* ============================================================ */}
        {/*  Contact & Resume CTA                                        */}
        {/* ============================================================ */}
        <ContactCTA />
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  404 placeholder                                                   */
/* ------------------------------------------------------------------ */

function NotFound() {
  const { language } = useLanguage();
  return (
    <main className="flex min-h-screen items-center justify-center py-20">
      <div className="mx-auto w-full max-w-lg px-4 text-center">
        <span className="select-none text-8xl font-bold text-border/50">404</span>
        <h1 className="mt-4 text-2xl font-bold text-text">
          {language === 'zh' ? '作品未找到' : 'Work Not Found'}
        </h1>
        <p className="mt-2 text-text-secondary">
          {language === 'zh'
            ? '您访问的作品不存在或已被移除。'
            : 'The work you are looking for does not exist or has been removed.'}
        </p>
        <Link
          href="/works"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回作品列表' : 'Back to Works'}
        </Link>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const work = works.find((w) => w.id === id);

  if (!work) {
    return <NotFound />;
  }

  return <WorkDetailContent work={work} />;
}