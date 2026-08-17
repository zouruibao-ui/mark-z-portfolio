'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  UserCircle, Globe, Lock, Eye, EyeOff, Clock, Shield, Save,
  Power, PowerOff, Wrench, ChevronDown, ChevronUp, Edit3,
  Copy, Trash2, Plus, ExternalLink, FileText, Layout,
  MessageSquare, Search, Settings, Calendar, RefreshCw, AlertTriangle,
  CheckCircle2, XCircle, Monitor, Languages, Sparkles
} from 'lucide-react'

type SiteMode = 'open' | 'maintenance' | 'closed'

export default function PersonalCenterPage() {
  const router = useRouter()
  const [isZh, setIsZh] = useState(true)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'access' | 'layout' | 'content'>('overview')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Data states
  const [stats, setStats] = useState<any>(null)
  const [access, setAccess] = useState<any>(null)
  const [layout, setLayout] = useState<any>(null)
  const [content, setContent] = useState<any[]>([])

  useEffect(() => {
    const lang = localStorage.getItem('portfolio-language') || 'zh'
    setIsZh(lang === 'zh')
    loadAll()
  }, [])

  const msg = (zh: string, en: string) => isZh ? zh : en

  const loadAll = async () => {
    setLoading(true)
    try {
      const [statsRes, accessRes, layoutRes, contentRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/access').then(r => r.json()),
        fetch('/api/layout').then(r => r.json()),
        fetch('/api/content').then(r => r.json()),
      ])
      if (statsRes.stats) setStats(statsRes.stats)
      if (accessRes.access) setAccess(accessRes.access)
      if (layoutRes.layout) setLayout(layoutRes.layout)
      if (contentRes.content) setContent(contentRes.content)
    } catch (e) {
      console.error('Failed to load personal center data', e)
    }
    setLoading(false)
  }

  const saveAccess = async (updates: any) => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/access', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (res.ok) { setAccess(data.access); setSuccess(msg('访问控制已更新', 'Access control updated')) }
      else { setError(data.error || 'Save failed') }
    } catch { setError('Network error') }
    setSaving(false)
  }

  const saveLayout = async (updates: any) => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (res.ok) { setLayout(data.layout); setSuccess(msg('布局已更新', 'Layout updated')) }
      else { setError(data.error || 'Save failed') }
    } catch { setError('Network error') }
    setSaving(false)
  }

  const saveContentItem = async (key: string, zh: string, en: string) => {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, zh, en }),
      })
      if (res.ok) { setSuccess(msg('内容已更新', 'Content updated')); loadAll() }
      else { const data = await res.json(); setError(data.error || 'Save failed') }
    } catch { setError('Network error') }
    setSaving(false)
  }

  const toggleSection = (sectionId: string) => {
    if (!layout) return
    const sections = layout.sections.map((s: any) =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    )
    saveLayout({ sections })
  }

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!layout) return
    const sections = [...layout.sections]
    const idx = sections.findIndex((s: any) => s.id === sectionId)
    if (idx === -1) return
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= sections.length) return
    const temp = sections[idx].order
    sections[idx].order = sections[newIdx].order
    sections[newIdx].order = temp
    sections.sort((a: any, b: any) => a.order - b.order)
    sections.forEach((s: any, i: number) => { s.order = i })
    setLayout({ ...layout, sections })
    saveLayout({ sections })
  }

  const setSiteMode = (mode: SiteMode) => saveAccess({ currentMode: mode })

  const tabs = [
    { id: 'overview' as const, icon: UserCircle, labelZh: '概览', labelEn: 'Overview' },
    { id: 'access' as const, icon: Shield, labelZh: '访问控制', labelEn: 'Access' },
    { id: 'layout' as const, icon: Layout, labelZh: '布局设置', labelEn: 'Layout' },
    { id: 'content' as const, icon: FileText, labelZh: '内容编辑', labelEn: 'Content' },
  ]

  const contentCategories = [
    { value: 'hero', labelZh: '首页', labelEn: 'Hero' },
    { value: 'about', labelZh: '关于', labelEn: 'About' },
    { value: 'evidence', labelZh: '成果', labelEn: 'Evidence' },
    { value: 'seo', labelZh: 'SEO', labelEn: 'SEO' },
  ]

  const sectionLabels: Record<string, { zh: string; en: string }> = {
    hero: { zh: '首页英雄区', en: 'Hero Section' },
    'featured-works': { zh: '精选作品', en: 'Featured Works' },
    skills: { zh: '核心能力', en: 'Skills' },
    evidence: { zh: '成果与影响', en: 'Evidence' },
    experience: { zh: '职业经历', en: 'Experience' },
    'about-summary': { zh: '关于摘要', en: 'About Summary' },
    contact: { zh: '联系与下载', en: 'Contact' },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {msg('个人中心', 'Personal Center')}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {msg('统一管理网站所有内容', 'Manage all site content in one place')}
          </p>
        </div>
        <button
          onClick={loadAll}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:bg-bg-alt transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {msg('刷新', 'Refresh')}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text hover:border-border'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {isZh ? tab.labelZh : tab.labelEn}
          </button>
        ))}
      </div>

      {/* ============ OVERVIEW TAB ============ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: msg('作品总数', 'Total Works'), value: stats?.totalWorks || 0, color: 'text-blue-600 bg-blue-100' },
              { icon: Eye, label: msg('已发布', 'Published'), value: stats?.publishedWorks || 0, color: 'text-emerald-600 bg-emerald-100' },
              { icon: Layout, label: msg('可见区块', 'Visible Sections'), value: stats?.sectionsVisible || 0, color: 'text-purple-600 bg-purple-100' },
              { icon: Globe, label: msg('网站状态', 'Site Status'), value: access?.currentMode === 'open' ? msg('开放中', 'Open') : access?.currentMode === 'maintenance' ? msg('维护中', 'Maintenance') : msg('已关闭', 'Closed'), color: access?.currentMode === 'open' ? 'text-green-600 bg-green-100' : 'text-amber-600 bg-amber-100' },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-text">{stat.value}</p>
                    <p className="text-xs text-text-secondary">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-text mb-4">
              {msg('快捷操作', 'Quick Actions')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => router.push('/admin/works/new')} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-bg-alt p-4 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                <Plus className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium text-text">{msg('新建作品', 'New Work')}</span>
              </button>
              <button onClick={() => setActiveTab('access')} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-bg-alt p-4 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                <Shield className="h-5 w-5 text-amber-500" />
                <span className="text-xs font-medium text-text">{msg('访问控制', 'Access Control')}</span>
              </button>
              <button onClick={() => setActiveTab('layout')} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-bg-alt p-4 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                <Layout className="h-5 w-5 text-purple-500" />
                <span className="text-xs font-medium text-text">{msg('布局设置', 'Layout')}</span>
              </button>
              <button onClick={() => setActiveTab('content')} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-bg-alt p-4 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                <Edit3 className="h-5 w-5 text-emerald-500" />
                <span className="text-xs font-medium text-text">{msg('编辑内容', 'Edit Content')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ ACCESS CONTROL TAB ============ */}
      {activeTab === 'access' && access && (
        <div className="space-y-6">
          {/* Current mode selector */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-text mb-4">
              {msg('当前模式', 'Current Mode')}
            </h2>
            <div className="flex gap-3">
              {[
                { mode: 'open' as SiteMode, icon: Globe, label: msg('开放访问', 'Open'), color: 'bg-green-100 text-green-700 border-green-200', hoverColor: 'hover:bg-green-50' },
                { mode: 'maintenance' as SiteMode, icon: Wrench, label: msg('维护模式', 'Maintenance'), color: 'bg-amber-100 text-amber-700 border-amber-200', hoverColor: 'hover:bg-amber-50' },
                { mode: 'closed' as SiteMode, icon: Lock, label: msg('关闭访问', 'Closed'), color: 'bg-red-100 text-red-700 border-red-200', hoverColor: 'hover:bg-red-50' },
              ].map((option) => (
                <button
                  key={option.mode}
                  onClick={() => setSiteMode(option.mode)}
                  disabled={saving}
                  className={`flex-1 flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                    access.currentMode === option.mode
                      ? option.color + ' border-current'
                      : 'border-border bg-bg text-text-secondary ' + option.hoverColor
                  } disabled:opacity-50`}
                >
                  <option.icon className="h-8 w-8" />
                  <span className="text-sm font-semibold">{option.label}</span>
                  {access.currentMode === option.mode && (
                    <span className="text-xs font-medium">{msg('当前', 'Active')}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scheduled access */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-text mb-4">
              {msg('定时开关', 'Scheduled Access')}
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              {msg('设定一个未来时间点自动切换网站模式', 'Schedule an automatic mode change at a future time')}
            </p>
            {access.schedules.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <Calendar className="mx-auto h-8 w-8 text-text-secondary/50 mb-2" />
                <p className="text-sm text-text-secondary">
                  {msg('暂无定时计划', 'No scheduled plans')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {access.schedules.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-bg-alt p-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-text">{s.label}</p>
                        <p className="text-xs text-text-secondary">
                          {s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : msg('未设置时间', 'No time set')}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-text-secondary">{s.mode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ LAYOUT TAB ============ */}
      {activeTab === 'layout' && layout && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-text mb-4">
              {msg('首页区块管理', 'Homepage Sections')}
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              {msg('上下移动调整顺序，点击眼睛图标显示/隐藏区块。', 'Move sections to reorder, toggle visibility with the eye icon.')}
            </p>
            <div className="space-y-2">
              {[...layout.sections]
                .sort((a: any, b: any) => a.order - b.order)
                .map((section: any, index: number) => {
                  const label = sectionLabels[section.id as keyof typeof sectionLabels]
                  return (
                    <div key={section.id} className="flex items-center justify-between rounded-lg border border-border bg-bg-alt p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary w-5 text-right">{index + 1}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-text">
                            {isZh ? label?.zh : label?.en}
                          </span>
                          <span className="text-xs text-text-secondary">{section.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveSection(section.id, 'up')}
                          disabled={index === 0}
                          className="rounded-lg p-1.5 text-text-secondary hover:bg-bg transition-colors disabled:opacity-30"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveSection(section.id, 'down')}
                          disabled={index === layout.sections.length - 1}
                          className="rounded-lg p-1.5 text-text-secondary hover:bg-bg transition-colors disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className={`rounded-lg p-1.5 transition-colors ${
                            section.visible
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-red-400 hover:bg-red-50'
                          }`}
                        >
                          {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {/* ============ CONTENT TAB ============ */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {/* Category quick jump */}
          <div className="flex gap-2 flex-wrap">
            {contentCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  document.getElementById(`content-${cat.value}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-alt transition-colors"
              >
                {isZh ? cat.labelZh : cat.labelEn}
              </button>
            ))}
          </div>

          {contentCategories.map((cat) => {
            const items = content.filter((c) => c.category === cat.value)
            if (items.length === 0) return null
            return (
              <div key={cat.value} id={`content-${cat.value}`} className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-text mb-4">
                  {isZh ? cat.labelZh : cat.labelEn}
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <ContentEditor
                      key={item.key}
                      item={item}
                      isZh={isZh}
                      onSave={saveContentItem}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {content.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-text-secondary">
                {msg('暂无可编辑内容', 'No editable content available')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Content Editor Sub-component                                      */
/* ------------------------------------------------------------------ */

function ContentEditor({
  item,
  isZh,
  onSave,
}: {
  item: any
  isZh: boolean
  onSave: (key: string, zh: string, en: string) => Promise<void>
}) {
  const [zh, setZh] = useState(item.zh || '')
  const [en, setEn] = useState(item.en || '')
  const [editing, setEditing] = useState(false)

  const handleSave = async () => {
    await onSave(item.key, zh, en)
    setEditing(false)
  }

  return (
    <div className="rounded-lg border border-border bg-bg-alt p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-text">{item.key}</p>
          <p className="text-xs text-text-secondary">{item.description}</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="rounded-lg px-2 py-1 text-xs font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              {isZh ? '保存' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(false); setZh(item.zh || ''); setEn(item.en || '') }}
              className="rounded-lg px-2 py-1 text-xs font-medium text-text-secondary hover:bg-bg transition-colors"
            >
              {isZh ? '取消' : 'Cancel'}
            </button>
          </div>
        )}
      </div>
      {editing ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-text-secondary mb-1">中文</label>
              <textarea
                value={zh}
                onChange={(e) => setZh(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-text-secondary mb-1">English</label>
              <textarea
                value={en}
                onChange={(e) => setEn(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 text-xs text-text-secondary">
          <span className="flex-1"><span className="font-medium">中文:</span> {item.zh}</span>
          <span className="flex-1"><span className="font-medium">EN:</span> {item.en}</span>
        </div>
      )}
    </div>
  )
}