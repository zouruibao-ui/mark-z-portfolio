'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mail, Lock, KeyRound, LogIn, ShieldAlert, LayoutDashboard, FolderKanban, Eye, Download } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [isZh, setIsZh] = useState(true)
  const [stats, setStats] = useState({ works: 0, featured: 0, categories: 0 })
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [devCode, setDevCode] = useState('')

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        setAuthenticated(true)
        const lang = localStorage.getItem('portfolio-language') || 'zh'
        setIsZh(lang === 'zh')
        // Load stats
        const worksRes = await fetch('/api/works')
        const worksData = await worksRes.json()
        if (worksData.works) {
          const cats = new Set(worksData.works.map((w: any) => w.category))
          setStats({
            works: worksData.works.length,
            featured: worksData.works.filter((w: any) => w.featured).length,
            categories: cats.size,
          })
        }
      } else {
        setAuthenticated(false)
      }
    } catch {
      setAuthenticated(false)
    }
  }, [])

  useEffect(() => { checkAuth() }, [checkAuth])

  const handleSendCode = async () => {
    if (!email) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setCodeSent(true)
        if (data.code) setDevCode(data.code)
      } else {
        setError(data.error || 'Failed to send code')
      }
    } catch {
      setError('Network error')
    }
    setSending(false)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !code) return
    setVerifying(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (res.ok) {
        setAuthenticated(true)
        checkAuth()
      } else {
        setError(data.error || 'Invalid code')
      }
    } catch {
      setError('Network error')
    }
    setVerifying(false)
  }

  // Loading
  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // Dashboard (authenticated)
  if (authenticated) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text mb-8">
          {isZh ? '控制台' : 'Dashboard'}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: FolderKanban, label: isZh ? '作品总数' : 'Total Works', value: stats.works, color: 'text-blue-600 bg-blue-100' },
            { icon: Eye, label: isZh ? '精选作品' : 'Featured', value: stats.featured, color: 'text-emerald-600 bg-emerald-100' },
            { icon: LayoutDashboard, label: isZh ? '作品分类' : 'Categories', value: stats.categories, color: 'text-purple-600 bg-purple-100' },
            { icon: Download, label: isZh ? '部署状态' : 'Status', value: isZh ? '运行中' : 'Running', color: 'text-green-600 bg-green-100' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text">{stat.value}</p>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">
            {isZh ? '快捷操作' : 'Quick Actions'}
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/admin/works/new')}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              {isZh ? '新增作品' : 'New Work'}
            </button>
            <button
              onClick={() => router.push('/admin/works')}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm font-medium text-text hover:bg-bg transition-colors"
            >
              {isZh ? '管理作品' : 'Manage Works'}
            </button>
            <button
              onClick={() => router.push('/admin/settings')}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm font-medium text-text hover:bg-bg transition-colors"
            >
              {isZh ? '网站设置' : 'Settings'}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm font-medium text-text hover:bg-bg transition-colors"
            >
              {isZh ? '查看网站' : 'View Site'}
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Login form
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg py-20">
      <div className="mx-auto w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold tracking-tight text-text">
            {isZh ? '管理后台' : 'Admin Panel'}
          </h1>

          <div className="mt-4 rounded-lg border border-dashed border-primary/20 bg-primary/5 px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{isZh ? '仅限站点所有者访问' : 'Only the site owner'}</span>
            </div>
          </div>

          {/* Dev code display */}
          {devCode && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center">
              <p className="text-xs font-medium text-amber-800 mb-1">DEV MODE</p>
              <p className="text-lg font-bold text-amber-700 tracking-widest">{devCode}</p>
            </div>
          )}

          {!codeSent ? (
            <>
              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-text">
                  {isZh ? '邮箱' : 'Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isZh ? '输入邮箱地址' : 'Enter your email'}
                    className="w-full rounded-xl border border-border bg-bg px-10 py-3 text-sm text-text outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              <button
                onClick={handleSendCode}
                disabled={!email || sending}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                {sending ? (isZh ? '发送中...' : 'Sending...') : (isZh ? '发送验证码' : 'Send Code')}
              </button>
            </>
          ) : (
            <form onSubmit={handleVerify}>
              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-text">
                  {isZh ? '验证码' : 'Verification Code'}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={isZh ? '输入验证码' : 'Enter code'}
                    className="w-full rounded-xl border border-border bg-bg px-10 py-3 text-sm text-text outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                </div>
              </div>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setCodeSent(false); setCode(''); setError('') }}
                  className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-alt transition-colors"
                >
                  {isZh ? '返回' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={!code || verifying}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  {verifying ? (isZh ? '验证中...' : 'Verifying...') : (isZh ? '登录' : 'Sign In')}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}