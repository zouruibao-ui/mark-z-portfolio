'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FolderKanban, Settings, LogOut, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react'

const SIDEBAR_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, labelZh: '控制台', labelEn: 'Dashboard' },
  { href: '/admin/personal', icon: UserCircle, labelZh: '个人中心', labelEn: 'Personal Center' },
  { href: '/admin/works', icon: FolderKanban, labelZh: '作品管理', labelEn: 'Works' },
  { href: '/admin/settings', icon: Settings, labelZh: '网站设置', labelEn: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isZh, setIsZh] = useState(true)

  useEffect(() => {
    const lang = localStorage.getItem('portfolio-language') || 'zh'
    setIsZh(lang === 'zh')

    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true)
        } else {
          setAuthenticated(false)
          if (pathname !== '/admin') {
            router.push('/admin')
          }
        }
      })
      .catch(() => {
        setAuthenticated(false)
      })
  }, [pathname, router])

  // Login page — render children without sidebar
  if (pathname === '/admin' && !authenticated) {
    return <>{children}</>
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!authenticated) {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-border transition-all duration-300 ${
          sidebarOpen ? 'w-60' : 'w-16'
        } md:relative`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {sidebarOpen && (
            <Link href="/admin" className="text-lg font-bold text-text">
              Admin
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-alt transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive =
              (item.href === '/admin' && pathname === '/admin') ||
              (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-bg-alt hover:text-text'
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                {sidebarOpen && <span>{isZh ? item.labelZh : item.labelEn}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span>{isZh ? '退出登录' : 'Logout'}</span>}
          </button>
          <Link
            href="/"
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-alt transition-colors"
          >
            <ChevronLeft size={20} className="shrink-0" />
            {sidebarOpen && <span>{isZh ? '返回网站' : 'Back to site'}</span>}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}