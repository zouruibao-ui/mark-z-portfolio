'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react'

export default function AdminSettings() {
  const router = useRouter()
  const [isZh, setIsZh] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [config, setConfig] = useState({
    title: 'Mark Z',
    subtitle_zh: '',
    subtitle_en: '',
    description_zh: '',
    description_en: '',
    author: 'Mark Z (邹瑞宝)',
    email: '',
    phone: '',
    wechatQr: '',
    jobStatus_zh: '',
    jobStatus_en: '',
    adminEmail: '',
    adminBackupEmail: '',
    socialLinks: [{ platform: 'LinkedIn', url: '', label: 'LinkedIn' }],
  })

  useEffect(() => {
    const lang = localStorage.getItem('portfolio-language') || 'zh'
    setIsZh(lang === 'zh')
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/config')
      const data = await res.json()
      if (data.config) {
        const c = data.config
        setConfig({
          title: c.title || 'Mark Z',
          subtitle_zh: c.subtitle?.zh || '',
          subtitle_en: c.subtitle?.en || '',
          description_zh: c.description?.zh || '',
          description_en: c.description?.en || '',
          author: c.author || '',
          email: c.email || '',
          phone: c.phone || '',
          wechatQr: c.wechatQr || '',
          jobStatus_zh: c.jobStatus?.zh || '',
          jobStatus_en: c.jobStatus?.en || '',
          adminEmail: c.adminEmail || '',
          adminBackupEmail: c.adminBackupEmail || '',
          socialLinks: c.socialLinks?.length ? c.socialLinks : [{ platform: 'LinkedIn', url: '', label: 'LinkedIn' }],
        })
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: config.title,
          subtitle: { zh: config.subtitle_zh, en: config.subtitle_en },
          description: { zh: config.description_zh, en: config.description_en },
          author: config.author,
          email: config.email,
          phone: config.phone,
          wechatQr: config.wechatQr,
          jobStatus: { zh: config.jobStatus_zh, en: config.jobStatus_en },
          adminEmail: config.adminEmail,
          adminBackupEmail: config.adminBackupEmail,
          socialLinks: config.socialLinks,
        }),
      })
      if (res.ok) {
        setSuccess(isZh ? '保存成功' : 'Saved successfully')
      } else {
        setError('Save failed')
      }
    } catch {
      setError('Network error')
    }
    setSaving(false)
  }

  const addSocialLink = () => {
    setConfig({ ...config, socialLinks: [...config.socialLinks, { platform: '', url: '', label: '' }] })
  }

  const removeSocialLink = (index: number) => {
    setConfig({ ...config, socialLinks: config.socialLinks.filter((_, i) => i !== index) })
  }

  const updateSocialLink = (index: number, field: string, value: string) => {
    const links = [...config.socialLinks]
    links[index] = { ...links[index], [field]: value }
    setConfig({ ...config, socialLinks: links })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-text-secondary hover:bg-bg-alt transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-text">{isZh ? '网站设置' : 'Site Settings'}</h1>
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">{success}</div>}

      <div className="space-y-8">
        {/* Basic Info */}
        <section>
          <h2 className="text-lg font-semibold text-text mb-4">{isZh ? '基本信息' : 'Basic Info'}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">Title</label>
                <input type="text" value={config.title} onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">Author</label>
                <input type="text" value={config.author} onChange={(e) => setConfig({ ...config, author: e.target.value })}
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '副标题（中文）' : 'Subtitle (Chinese)'}</label>
              <input type="text" value={config.subtitle_zh} onChange={(e) => setConfig({ ...config, subtitle_zh: e.target.value })}
                className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '副标题（英文）' : 'Subtitle (English)'}</label>
              <input type="text" value={config.subtitle_en} onChange={(e) => setConfig({ ...config, subtitle_en: e.target.value })}
                className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="text-lg font-semibold text-text mb-4">{isZh ? '联系信息' : 'Contact Info'}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">Email</label>
                <input type="email" value={config.email} onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '电话' : 'Phone'}</label>
                <input type="text" value={config.phone} onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '微信二维码路径' : 'WeChat QR Path'}</label>
              <input type="text" value={config.wechatQr} onChange={(e) => setConfig({ ...config, wechatQr: e.target.value })}
                className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        {/* Job Status */}
        <section>
          <h2 className="text-lg font-semibold text-text mb-4">{isZh ? '求职状态' : 'Job Status'}</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '中文' : 'Chinese'}</label>
              <input type="text" value={config.jobStatus_zh} onChange={(e) => setConfig({ ...config, jobStatus_zh: e.target.value })}
                className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '英文' : 'English'}</label>
              <input type="text" value={config.jobStatus_en} onChange={(e) => setConfig({ ...config, jobStatus_en: e.target.value })}
                className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        {/* Admin */}
        <section>
          <h2 className="text-lg font-semibold text-text mb-4">Admin</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '管理员邮箱' : 'Admin Email'}</label>
              <input type="email" value={config.adminEmail} onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })}
                className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">{isZh ? '备用邮箱' : 'Backup Email'}</label>
              <input type="email" value={config.adminBackupEmail} onChange={(e) => setConfig({ ...config, adminBackupEmail: e.target.value })}
                className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">{isZh ? '社交链接' : 'Social Links'}</h2>
            <button onClick={addSocialLink}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-bg-alt transition-colors">
              <Plus className="h-3.5 w-3.5" />
              {isZh ? '添加' : 'Add'}
            </button>
          </div>
          <div className="space-y-3">
            {config.socialLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="text" value={link.platform} onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                  placeholder="Platform" className="w-32 rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary" />
                <input type="text" value={link.url} onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                  placeholder="URL" className="flex-1 rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary" />
                <input type="text" value={link.label} onChange={(e) => updateSocialLink(i, 'label', e.target.value)}
                  placeholder="Label" className="w-28 rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary" />
                <button onClick={() => removeSocialLink(i)}
                  className="rounded-lg p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Save button */}
        <div className="pt-4 pb-12">
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-50 transition-all">
            {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
            {saving ? (isZh ? '保存中...' : 'Saving...') : (isZh ? '保存设置' : 'Save Settings')}
          </button>
        </div>
      </div>
    </div>
  )
}