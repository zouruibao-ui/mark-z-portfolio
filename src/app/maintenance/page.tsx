'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Wrench, Lock, Shield } from 'lucide-react'

function MaintenanceContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'maintenance'
  const [isZh, setIsZh] = useState(true)

  useEffect(() => {
    const lang = localStorage.getItem('portfolio-language') || 'zh'
    setIsZh(lang === 'zh')
  }, [])

  const isMaintenance = mode === 'maintenance'

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="mx-auto w-full max-w-md px-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          {isMaintenance ? (
            <Wrench className="h-10 w-10 text-primary" />
          ) : (
            <Lock className="h-10 w-10 text-red-500" />
          )}
        </div>

        <h1 className="mt-6 text-3xl font-bold text-text">
          {isMaintenance
            ? (isZh ? '网站维护中' : 'Under Maintenance')
            : (isZh ? '网站已关闭' : 'Site Closed')}
        </h1>

        <p className="mt-4 text-text-secondary leading-relaxed">
          {isZh
            ? '网站正在维护升级中，请稍后再来访问。感谢您的理解与支持。'
            : 'The site is currently undergoing maintenance. Please check back later. Thank you for your understanding.'}
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-text-secondary">
          <Shield className="h-4 w-4" />
          {isZh ? '管理员可通过后台绕过' : 'Admins can bypass via dashboard'}
        </div>
      </div>
    </div>
  )
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <MaintenanceContent />
    </Suspense>
  )
}