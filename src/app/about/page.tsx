'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Globe,
  Users,
  Sparkles,
  Compass,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Film,
  Plane,
  Wrench,
  Mail,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig, skills } from '@/data/site-config';

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

/* The 80/20 rule — drive the brief mostly professional, with a       */
/* genuine personal touch so the page reads as a person, not a   */
/* rendered CV.                                                       */

const bio = {
  zh: {
    paragraphs: [
      'Mark 拥有国际化的成长背景，长期浸染于跨文化环境，积累了品牌与传播领域的实践经验。他习惯于站在全球视角思考问题，也乐于把这种视角带进每一个内容项目。',
      '他善于与多元团队协作，能够在不同文化、不同专业背景之间搭建沟通的桥梁，让观点被理解、让协作真正发生。',
      '作为一名 AI 原生的品牌策略师，Mark 持续探索生成式人工智能在品牌创意与内容生产中的前沿应用，把新工具转化为可落地的表达。',
      '他对品牌高度敏感，能够精准捕捉市场趋势与消费者洞察，让每次内容决策都建立在策略而非直觉之上。',
    ],
    personal:
      '工作之外，我喜欢看纪录片、攒老电影，也喜欢拎着相机到处走走，用另一种语言记录世界。技术是手段，理解人与文化才是让我保持好奇的原因。',
    photoLabel: '个人照片占位',
  },
  en: {
    paragraphs: [
      "Mark has an international background, steeped in cross-cultural environments, with hands-on experience across branding and communications. He naturally thinks from a global perspective and brings that lens into every content project.",
      'He thrives in diverse teams, building bridges across cultures and disciplines so ideas are understood and collaboration actually happens.',
      'As an AI-native brand strategist, Mark keeps exploring how generative AI can push brand creativity and content production forward — turning new tools into expressions that land.',
      'He is deeply brand-sensitive, sharp on market trends and consumer insight, so every content decision is grounded in strategy rather than gut feel.',
    ],
    personal:
      'Beyond work, I love documentaries and old films, and wandering around with a camera — quietly recording the world in another language. Technology is a means; understanding people and culture is what keeps me curious.',
    photoLabel: 'Photo placeholder',
  },
};

const timeline = {
  zh: [
    {
      year: '2024 — 至今',
      type: 'work' as const,
      title: '火星人智能科技',
      subtitle: '内容与品牌方向',
      description: '负责品牌内容策略与 AI 内容实验，搭建 AI 短视频内容协作系统。',
    },
    {
      year: '核心实践期',
      type: 'work' as const,
      title: '凤凰网',
      subtitle: '融媒体内容实践',
      description: '融媒体内容策划、采编与数据驱动的短视频创作。',
    },
    {
      year: '2022 — 2024',
      type: 'education' as const,
      title: '新闻与传播类专业 · 本科教育',
      subtitle: '专业基础与项目实践',
      description: '系统学习新闻传播与品牌内容，参与多个跨平台创作项目。',
    },
  ],
  en: [
    {
      year: '2024 — Present',
      type: 'work' as const,
      title: 'Mars Intelligence Tech',
      subtitle: 'Content & Brand Direction',
      description: 'Leading brand content strategy and AI content experiments; built an AI short-video collaboration system.',
    },
    {
      year: 'Core Practice',
      type: 'work' as const,
      title: 'Phoenix News',
      subtitle: 'Converged Media Practice',
      description: 'Converged media content planning, reporting, and data-driven short video production.',
    },
    {
      year: '2022 — 2024',
      type: 'education' as const,
      title: 'Undergraduate · Journalism & Communication',
      subtitle: 'Foundation & Project Practice',
      description: 'Systematic study of journalism and brand content, plus hands-on cross-platform creation projects.',
    },
  ],
};

const personalNotes = {
  zh: [
    { icon: Film, title: '影像与纪录片', desc: '用画面叙事，收藏真实的故事' },
    { icon: Plane, title: '行走与观察', desc: '从不同城市与文化里找灵感' },
    { icon: Wrench, title: '新工具尝鲜', desc: '对 AI 与创作工具保持好奇心' },
  ],
  en: [
    { icon: Film, title: 'Visual & Doc', desc: 'Telling real stories through images' },
    { icon: Plane, title: 'Wandering & Observing', desc: 'Finding inspiration across cities and cultures' },
    { icon: Wrench, title: 'Early Adopter', desc: 'Curious about AI and creative tools' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
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
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small reusable pieces                                             */
/* ------------------------------------------------------------------ */

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10 md:mb-12">
      <h2 className="text-2xl font-bold text-text md:text-3xl">{title}</h2>
      <div className="mt-3 h-1 w-14 rounded-full bg-primary" />
      <p className="mt-4 max-w-2xl text-sm text-text-secondary md:text-base">
        {subtitle}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  About page                                                        */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  const { language, t } = useLanguage();
  const isZh = language === 'zh';
  const content = isZh ? bio.zh : bio.en;
  const tl = language === 'zh' ? timeline.zh : timeline.en;
  const notes = language === 'zh' ? personalNotes.zh : personalNotes.en;

  return (
    <main className="min-h-screen py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8">
        {/* ========================================================== */}
        {/*  Hero — editorial header                                   */}
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
            {isZh ? '关于 Mark Z' : 'About Mark Z'}
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="mt-4 text-4xl font-bold tracking-tight text-text md:text-5xl"
          >
            {isZh ? '关于我' : 'About Me'}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-5 max-w-xl text-text-responsive text-text-secondary"
          >
            {isZh
              ? '品牌内容 × 国际传播 × AI 创意 —— 用全球视野与新技术，讲好每一个品牌故事。'
              : 'Brand Content × Global Communication × AI Creativity — telling brand stories with a global lens and new technologies.'}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-6 h-1 w-16 rounded-full bg-primary"
          />
        </motion.div>

        {/* ========================================================== */}
        {/*  Bio — photo placeholder (gray box) + editorial paragraphs  */}
        {/* ========================================================== */}
        <RevealSection>
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[300px_1fr] md:gap-14">
            {/* Photo placeholder — gray box */}
            <div className="mx-auto w-full max-w-[300px] md:mx-0">
              <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-bg-alt text-text-secondary/60">
                <User className="h-14 w-14" strokeWidth={1.5} />
                <span className="text-xs font-medium uppercase tracking-widest">
                  {content.photoLabel}
                </span>
              </div>
              <p className="mt-3 text-center text-xs text-text-secondary md:text-left">
                {isZh
                  ? '专业形象照占位 —— 后续替换为真实照片。'
                  : 'Placeholder for a professional photo — swap in the real one later.'}
              </p>
            </div>

            {/* Bio paragraphs */}
            <div className="space-y-5">
              {content.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-responsive text-text/90 [&_strong]:font-semibold"
                >
                  {p}
                </p>
              ))}

              {/* A closing personal sentence — the "20%" */}
              <p className="border-l-2 border-primary pl-4 text-responsive text-text-secondary italic">
                {content.personal}
              </p>
            </div>
          </div>
        </RevealSection>

        {/* ========================================================== */}
        {/*  Timeline — career & education                             */}
        {/* ========================================================== */}
        <section className="mt-20 md:mt-28">
          <RevealSection>
            <SectionHeading
              title={isZh ? '经历' : 'Journey'}
              subtitle={
                isZh
                  ? '从内容实践到 AI 原生创作，一条持续上坡的成长路径。'
                  : 'From content practice to AI-native creation — a path of steady growth.'
              }
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="relative"
            >
              {/* Vertical line */}
              <div className="absolute left-[13px] top-2 bottom-2 w-px bg-border md:left-0 md:pl-0" />

              <div className="space-y-8">
                {tl.map((entry, idx) => {
                  const Icon = entry.type === 'work' ? Briefcase : GraduationCap;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="relative pl-10 md:pl-12"
                    >
                      {/* Node dot */}
                      <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">
                        {entry.year}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-text">
                        {entry.title}
                      </h3>
                      <p className="text-sm font-medium text-primary">
                        {entry.subtitle}
                      </p>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-text-secondary">
                        {entry.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </RevealSection>
        </section>

        {/* ========================================================== */}
        {/*  Skills summary                                            */}
        {/* ========================================================== */}
        <section className="mt-20 md:mt-28">
          <RevealSection>
            <SectionHeading
              title={isZh ? '核心能力' : 'Core Skills'}
              subtitle={
                isZh
                  ? '能力不只是一行简历 —— 是解决问题的具体方式。'
                  : 'Skills are more than a resume line — they are how problems get solved.'
              }
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {skills.map((skill) => {
                const title = skill[language].title;
                const desc = skill[language].desc;
                return (
                  <div
                    key={skill.id}
                    className="group rounded-xl border border-border bg-card border-l-4 border-l-primary/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-base font-semibold text-text">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Keyword chips */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                isZh
                  ? ['品牌定位', '内容策略', '双语内容', '海外社媒', 'AI 工作流', '短视频', 'IP 孵化', '数据分析']
                  : ['Brand Strategy', 'Content Strategy', 'Bilingual Content', 'Global Social', 'AI Workflow', 'Short Video', 'IP Incubation', 'Data Analysis'],
              ][0].map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-border bg-bg-alt px-3 py-1.5 text-xs font-medium text-text-secondary"
                >
                  {k}
                </span>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* ========================================================== */}
        {/*  Personal — the other 20%                                  */}
        {/* ========================================================== */}
        <section className="mt-20 md:mt-28">
          <RevealSection>
            <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
              <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_1.4fr]">
                <div>
                  <h2 className="text-2xl font-bold text-text md:text-3xl">
                    {isZh ? '工作之外' : 'Beyond Work'}
                  </h2>
                  <div className="mt-3 h-1 w-14 rounded-full bg-primary" />
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
                    {isZh
                      ? '一个好内容人首先是一个有趣的观察者。这些看似与专业无关的兴趣，往往才是灵感的真正来源。'
                      : 'A good content maker is first an interesting observer. These “unprofessional” interests are often where real inspiration lives.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {notes.map((note) => {
                    const Icon = note.icon;
                    return (
                      <div
                        key={note.title}
                        className="group rounded-xl border border-border bg-bg-alt p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                      >
                        <Icon className="mb-3 h-6 w-6 text-primary" />
                        <h3 className="text-sm font-semibold text-text">
                          {note.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                          {note.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ========================================================== */}
        {/*  CTA — 联系我                                               */}
        {/* ========================================================== */}
        <section className="mt-20 md:mt-28">
          <RevealSection>
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-border px-8 py-12 text-center md:px-14 md:py-16">
              <Mail className="mx-auto mb-4 h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-text md:text-4xl">
                {isZh ? '联系我' : 'Contact Me'}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
                {isZh
                  ? `如果你在做品牌、做内容、或者探索 AI 创作的可能，欢迎聊聊 —— 发邮件到 ${siteConfig.email}，或者直接约个时间。`
                  : `Working on a brand, content, or AI creativity? I would love to talk — reach me at ${siteConfig.email}, or say hi directly.`}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
                >
                  {isZh ? '去联系' : 'Get in Touch'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-7 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/5"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </RevealSection>
        </section>
      </div>
    </main>
  );
}