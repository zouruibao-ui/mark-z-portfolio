import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Proxy (Next.js 16 — formerly Middleware)
 *
 * Checks site access control on every request.
 * Only allows admin/api/static through when the site is closed.
 * Redirects regular users to the maintenance page.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow: admin routes, API routes, static assets, _next internals, maintenance page
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/resume') ||
    pathname === '/favicon.ico' ||
    pathname === '/maintenance' ||
    pathname.match(/\.(svg|jpg|jpeg|png|gif|ico|webp|css|js|woff2?)$/)
  ) {
    return NextResponse.next()
  }

  try {
    const { checkAccess } = await import('@/lib/access-gate')
    const result = await checkAccess(request.headers)

    if (!result.allowed) {
      const url = new URL('/maintenance', request.url)
      url.searchParams.set('mode', result.mode)
      return NextResponse.redirect(url)
    }
  } catch {
    // If access check fails, allow through (dev mode)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}