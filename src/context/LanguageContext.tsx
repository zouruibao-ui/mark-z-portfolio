'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Language = 'zh' | 'en';

interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<Language, Translations> = {
  zh: {
    nav: {
      works: '作品',
      about: '关于',
      resume: '简历',
      contact: '联系',
    },
    hero: {
      subtitle: '品牌策略师 / 跨文化叙事者',
      cta_works: '查看作品',
      cta_resume: '下载简历',
    },
    sections: {
      featuredWorks: '精选作品',
      abilities: '核心能力',
      evidence: '成果与影响',
      experience: '职业经历',
      aboutSummary: '关于 Mark Z',
      contactDownload: '联系与下载',
    },
    work: {
      viewProject: '查看项目',
      category: '类别',
      role: '角色',
      results: '成果',
      year: '年份',
      status: '状态',
      relatedWorks: '相关作品',
      backToList: '返回列表',
    },
    categories: {
      'brand-ip': { name: '品牌与IP' },
      'journalism': { name: '新闻与报道' },
      'video-documentary': { name: '视频与纪录片' },
      'ai-creative': { name: 'AI与创意' },
    },
    status: {
      published: { name: '已发布' },
      'in-progress': { name: '进行中' },
      'pending-result': { name: '待出结果' },
      awarded: { name: '已获奖' },
      archived: { name: '已归档' },
      'internal-only': { name: '内部仅限' },
    },
    aboutSummary: {
      description: '国际视野、善于协作、敢于尝试新技术、对品牌敏感',
      traits: {
        'global-vision': {
          title: '国际视野',
          desc: '拥有跨文化背景，善于在国际化环境中沟通与协作',
        },
        collaborative: {
          title: '善于协作',
          desc: '与多元团队高效协作，建立跨文化沟通桥梁',
        },
        'tech-explorer': {
          title: '拥抱新技术',
          desc: '积极尝试AI等前沿技术，探索内容创作新边界',
        },
        'brand-sensitive': {
          title: '品牌敏感',
          desc: '精准把握市场趋势与消费者洞察，赋予品牌独特价值',
        },
      },
      cta: '了解更多',
    },
    about: {
      title: '关于 Mark Z',
      p1: 'Mark Z 拥有国际化的成长背景，在跨文化环境中积累了丰富的品牌与传播经验。',
      p2: '他擅长与多元团队协作，能够在不同文化视角之间建立桥梁，推动品牌叙事在全球范围内产生共鸣。',
      p3: '作为 AI 原生的品牌策略师，Mark 积极探索生成式人工智能在品牌创意与内容生产中的前沿应用。',
      p4: '他对品牌敏感度极高，能够精准把握市场趋势与消费者洞察，为品牌赋予独特的策略价值。',
    },
    resume: {
      title: '简历',
      onlineVersion: '在线版本',
      downloadCn: '下载中文版',
      downloadEn: '下载英文版',
      comingSoon: '即将推出',
    },
    contact: {
      title: '联系我',
      email: '邮箱',
      phone: '电话',
      wechat: '微信',
      resume: '简历',
      social: '社交媒体',
      formTitle: '发送消息',
      formPlaceholder: '在这里输入您的消息……',
    },
    footer: {
      copyright: '© Mark Z',
      allRights: '保留所有权利',
    },
    admin: {
      title: '管理后台',
      loginTitle: '管理员登录',
      emailPlaceholder: '请输入邮箱',
      sendCode: '发送验证码',
      verifyTitle: '验证身份',
      codePlaceholder: '请输入验证码',
      verify: '验证',
      dashboard: '控制面板',
    },
    common: {
      loading: '加载中……',
      error: '出错了',
      notFound: '页面未找到',
      backToHome: '返回首页',
    },
  },
  en: {
    nav: {
      works: 'Works',
      about: 'About',
      resume: 'Resume',
      contact: 'Contact',
    },
    hero: {
      subtitle: 'Brand Strategist / Cross-Cultural Storyteller',
      cta_works: 'View Works',
      cta_resume: 'Download Resume',
    },
    sections: {
      featuredWorks: 'Featured Works',
      abilities: 'Core Abilities',
      evidence: 'Results & Impact',
      experience: 'Experience',
      aboutSummary: 'About Mark Z',
      contactDownload: 'Contact & Download',
    },
    work: {
      viewProject: 'View Project',
      category: 'Category',
      role: 'Role',
      results: 'Results',
      year: 'Year',
      status: 'Status',
      relatedWorks: 'Related Works',
      backToList: 'Back to List',
    },
    categories: {
      'brand-ip': { name: 'Brand & IP' },
      'journalism': { name: 'Journalism' },
      'video-documentary': { name: 'Video & Documentary' },
      'ai-creative': { name: 'AI & Creative' },
    },
    status: {
      published: { name: 'Published' },
      'in-progress': { name: 'In Progress' },
      'pending-result': { name: 'Pending Result' },
      awarded: { name: 'Awarded' },
      archived: { name: 'Archived' },
      'internal-only': { name: 'Internal Only' },
    },
    aboutSummary: {
      description: 'Global perspective, collaborative, embraces new tech, brand-sensitive',
      traits: {
        'global-vision': {
          title: 'Global Vision',
          desc: 'Cross-cultural background, adept at communicating in international environments',
        },
        collaborative: {
          title: 'Collaborative',
          desc: 'Works effectively with diverse teams, building cross-cultural bridges',
        },
        'tech-explorer': {
          title: 'Tech Explorer',
          desc: 'Actively explores AI and cutting-edge tech, pushing content creation boundaries',
        },
        'brand-sensitive': {
          title: 'Brand Sensitive',
          desc: 'Sharp market trends and consumer insights, delivering unique brand value',
        },
      },
      cta: 'Learn More',
    },
    about: {
      title: 'About Mark Z',
      p1: 'Mark Z has an international background, accumulating rich experience in branding and communications across cross-cultural environments.',
      p2: 'He excels at collaborating with diverse teams, building bridges between different cultural perspectives, and driving brand narratives that resonate globally.',
      p3: 'As an AI-native brand strategist, Mark actively explores cutting-edge applications of generative AI in brand creativity and content production.',
      p4: 'With a keen brand sensitivity, he accurately captures market trends and consumer insights, delivering unique strategic value for brands.',
    },
    resume: {
      title: 'Resume',
      onlineVersion: 'Online Version',
      downloadCn: 'Download Chinese',
      downloadEn: 'Download English',
      comingSoon: 'Coming Soon',
    },
    contact: {
      title: 'Contact Me',
      email: 'Email',
      phone: 'Phone',
      wechat: 'WeChat',
      resume: 'Resume',
      social: 'Social Media',
      formTitle: 'Send a Message',
      formPlaceholder: 'Type your message here…',
    },
    footer: {
      copyright: '© Mark Z',
      allRights: 'All Rights Reserved',
    },
    admin: {
      title: 'Admin',
      loginTitle: 'Admin Login',
      emailPlaceholder: 'Enter your email',
      sendCode: 'Send Code',
      verifyTitle: 'Verify Identity',
      codePlaceholder: 'Enter verification code',
      verify: 'Verify',
      dashboard: 'Dashboard',
    },
    common: {
      loading: 'Loading…',
      error: 'Something went wrong',
      notFound: 'Page Not Found',
      backToHome: 'Back to Home',
    },
  },
};

function getNestedValue(obj: Translations, path: string): string | undefined {
  const keys = path.split('.');
  let current: Translations | string = obj;
  for (const key of keys) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = current[key] as Translations | string;
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'zh';
  const stored = localStorage.getItem('portfolio-language');
  if (stored === 'zh' || stored === 'en') return stored;
  return 'zh';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('portfolio-language', language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const result = getNestedValue(translations[language], key);
      if (result === undefined) {
        const fallback = getNestedValue(translations['zh'], key);
        if (fallback !== undefined) return fallback;
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      return result;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslations(): (key: string) => string {
  const { t } = useLanguage();
  return t;
}