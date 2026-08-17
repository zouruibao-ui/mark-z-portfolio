import 'server-only'

export interface AccessCheck {
  allowed: boolean
  mode: 'open' | 'maintenance' | 'closed'
  message: { zh: string; en: string }
}

/**
 * Checks whether the current request should be allowed through.
 * This runs on every request via the proxy.
 */
export async function checkAccess(requestHeaders: Headers): Promise<AccessCheck> {
  const defaultClosed: AccessCheck = {
    allowed: true,
    mode: 'open',
    message: { zh: '', en: '' },
  }

  try {
    const { getSiteAccess } = await import('@/lib/db')
    const access = await getSiteAccess()

    // Admin bypass cookie
    const cookie = requestHeaders.get('cookie') || ''
    if (cookie.includes('bypass_active=true')) {
      return { allowed: true, mode: access.currentMode, message: { zh: '', en: '' } }
    }

    // Check for scheduled changes
    const now = Date.now()
    for (const schedule of access.schedules) {
      if (!schedule.enabled) continue
      if (schedule.scheduledAt && schedule.durationMinutes > 0) {
        const scheduledTime = new Date(schedule.scheduledAt).getTime()
        const endTime = scheduledTime + schedule.durationMinutes * 60 * 1000
        if (now >= scheduledTime && now < endTime) {
          if (schedule.mode !== 'open') {
            return { allowed: false, mode: schedule.mode, message: access.closedMessage }
          }
          return { allowed: true, mode: 'open', message: { zh: '', en: '' } }
        }
      }
    }

    // Check current mode
    if (access.currentMode === 'maintenance') {
      return { allowed: false, mode: 'maintenance', message: access.closedMessage }
    }
    if (access.currentMode === 'closed') {
      return { allowed: false, mode: 'closed', message: access.closedMessage }
    }

    return defaultClosed
  } catch {
    // If KV is not available, allow access (dev mode)
    return defaultClosed
  }
}