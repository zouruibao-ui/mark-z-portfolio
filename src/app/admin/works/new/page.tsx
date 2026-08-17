'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewWorkPage() {
  const router = useRouter()
  const [isZh, setIsZh] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    id: '',
    title_zh: '',
    title_en: '',
    category: 'brand-ip',
    tags: '',
    year: '',
    status: 'draft',
    role_zh: '',
    role_en: '',
    organization_zh: '',
    organization_en: '',
    summary_zh: '',
    summary_en: '',
    featured: false,
  })

  useState(() => {
    const lang = localStorage.getItem('portfolio-language') || 'zh'
    setIsZh(lang === 'zh')
  })

  const handleSave = async () => {
    if (!form.id || !form.title_zh) {
      setError(isZh ? 'ID 和中文标题为必填项' : 'ID and Chinese title are required')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.id,
          title: { zh: form.title_zh, en: form.title_en || form.title_zh },
          category: form.category,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
          year: form.year,
          status: form.status,
          role: { zh: form.role_zh, en: form.role_en },
          organization: { zh: form.organization_zh, en: form.organization_en },
          summary: { zh: form.summary_zh, en: form.summary_en },
          featured: form.featured,
        }),
      })

      if (res.ok) {
        router.push('/admin/works')
      } else {
        const data = await res.json()
        setError(data.error || 'Save failed')
      }
    } catch {
      setError('Network error')
    }
    setSaving(false)
  }

  const categories = [
    { value: 'brand-ip', zh: '品牌与IP', en: 'Brand & IP' },
    { value: 'journalism', zh: '新闻与报道', en: 'Journalism' },
    { value: 'video-documentary', zh: '视频与纪录片', en: 'Video & Documentary' },
    { value: 'ai-creative', zh: 'AI与创意', en: 'AI & Creative' },
  ]

  const statuses = [
    { value: 'draft', zh: '草稿', en: 'Draft' },
    { value: 'published', zh: '已发布', en: 'Published' },
    { value: 'in-progress', zh: '进行中', en: 'In Progress' },
    { value: 'pending-result', zh: '待出结果', en: 'Pending Result' },
    { value: 'awarded', zh: '已获奖', en: 'Awarded' },
    { value: 'archived', zh: '已归档', en: 'Archived' },
  ]

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-text-secondary hover:bg-bg-alt transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text">
            {isZh ? '新增作品' : 'New Work'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">ID *</label>
          <input
            type="text"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value.replace(/[^a-z0-9-]/g, '') })}
            placeholder="work-id (英文短横线格式)"
            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary"
          />
          <p className="mt-1 text-xs text-text-secondary">唯一标识符，创建后不可修改。例如：my-new-project</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '中文标题' : 'Chinese Title'} *</label>
            <input type="text" value={form.title_zh} onChange={(e) => setForm({ ...form, title_zh: e.target.value })}
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '英文标题' : 'English Title'}</label>
            <input type="text" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '分类' : 'Category'}</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary">
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{isZh ? c.zh : c.en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '状态' : 'Status'}</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary">
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>{isZh ? s.zh : s.en}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '年份' : 'Year'}</label>
            <input type="text" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2025"
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '标签' : 'Tags'}</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="AI, 短视频"
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
            <p className="mt-1 text-xs text-text-secondary">{isZh ? '用逗号分隔' : 'Comma-separated'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '角色（中文）' : 'Role (Chinese)'}</label>
            <input type="text" value={form.role_zh} onChange={(e) => setForm({ ...form, role_zh: e.target.value })}
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '角色（英文）' : 'Role (English)'}</label>
            <input type="text" value={form.role_en} onChange={(e) => setForm({ ...form, role_en: e.target.value })}
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '机构（中文）' : 'Organization (Chinese)'}</label>
            <input type="text" value={form.organization_zh} onChange={(e) => setForm({ ...form, organization_zh: e.target.value })}
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '机构（英文）' : 'Organization (English)'}</label>
            <input type="text" value={form.organization_en} onChange={(e) => setForm({ ...form, organization_en: e.target.value })}
              className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '中文摘要' : 'Chinese Summary'}</label>
          <textarea rows={3} value={form.summary_zh} onChange={(e) => setForm({ ...form, summary_zh: e.target.value })}
            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary resize-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '英文摘要' : 'English Summary'}</label>
          <textarea rows={3} value={form.summary_en} onChange={(e) => setForm({ ...form, summary_en: e.target.value })}
            className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary resize-none" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
          <label htmlFor="featured" className="text-sm font-medium text-text">
            {isZh ? '在首页展示' : 'Show on homepage'}
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-50 transition-all"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? (isZh ? '保存中...' : 'Saving...') : (isZh ? '保存作品' : 'Save Work')}
          </button>
        </div>
      </div>
    </div>
  )
}