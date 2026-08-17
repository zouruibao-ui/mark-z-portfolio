import 'server-only'

/* ============================================================
   Storage layer — Upstash Redis in production, JSON file locally
   ============================================================ */

export interface DbWorkItem {
  id: string
  title: { zh: string; en: string }
  category: string
  tags: string[]
  year: string
  status: string
  role: { zh: string; en: string }
  organization: { zh: string; en: string }
  coverImage: string
  summary: { zh: string; en: string }
  featured: boolean
  results: { zh: string; en: string }
  evidence: Array<{
    type: string
    label: string
    url?: string
    description: string
    isPublic: boolean
  }>
  modules: Array<{ id: string; type: string; zh: string; en: string }>
  relatedIds: string[]
  order: number
  createdAt: string
  updatedAt: string
}

export interface DbSiteConfig {
  title: string
  subtitle: { zh: string; en: string }
  description: { zh: string; en: string }
  author: string
  email: string
  phone: string
  wechatQr: string
  socialLinks: Array<{ platform: string; url: string; label: string }>
  jobStatus: { zh: string; en: string }
  adminEmail: string
  adminBackupEmail: string
}

/* ---------------- KV keys ---------------- */

const KEYS = {
  works: 'markz:works',
  config: 'markz:config',
  verified: 'markz:verified',
  code: 'markz:code',
} as const

/* ---------------- Lazy KV client ---------------- */

type KV = {
  get: (key: string) => Promise<any>
  set: (key: string, value: any, opts?: { ex?: number }) => Promise<any>
  del: (key: string) => Promise<any>
}

let _kv: KV | null | undefined = undefined

async function getKv(): Promise<KV | null> {
  if (_kv !== undefined) return _kv
  _kv = null
  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const { Redis } = await import('@upstash/redis')
      const url = process.env.UPSTASH_REDIS_REST_URL
      const token = process.env.UPSTASH_REDIS_REST_TOKEN
      const client = new Redis({ url, token })
      _kv = {
        get: (key) => client.get(key),
        set: (key, value, opts) => client.set(key, value, opts as any),
        del: (key) => client.del(key),
      }
    }
  } catch {
    _kv = null
  }
  return _kv
}

/* In-memory + JSON file fallback for local dev */
const memory: Record<string, any> = {}
const DATA_FILE = '.data/db.json'

async function getJSON(key: string): Promise<any> {
  const kv = await getKv()
  if (kv) return kv.get(key)
  if (key in memory) return memory[key]
  try {
    const fs = await import('fs')
    const path = await import('path')
    const raw = fs.readFileSync(path.join(process.cwd(), DATA_FILE), 'utf-8')
    const data = JSON.parse(raw)
    memory[key] = key in data ? data[key] : null
    return memory[key]
  } catch {
    memory[key] = null
    return null
  }
}

export async function setJSON(key: string, value: any) {
  memory[key] = value
  const kv = await getKv()
  if (kv) {
    await kv.set(key, value)
    return
  }
  try {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), DATA_FILE)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    let data: Record<string, any> = {}
    try { data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) } catch {}
    data[key] = value
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch {}
}

async function delJSON(key: string) {
  delete memory[key]
  const kv = await getKv()
  if (kv) {
    await kv.del(key)
    return
  }
  try {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), DATA_FILE)
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    delete data[key]
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch {}
}

/* ============================================================
   Works CRUD
   ============================================================ */

export async function getWorks(): Promise<DbWorkItem[]> {
  const works = await getJSON(KEYS.works)
  return Array.isArray(works) ? works : []
}

export async function getWork(id: string): Promise<DbWorkItem | null> {
  const works = await getWorks()
  return works.find((w) => w.id === id) || null
}

export async function saveWork(work: DbWorkItem): Promise<void> {
  const works = await getWorks()
  const idx = works.findIndex((w) => w.id === work.id)
  if (idx >= 0) {
    works[idx] = { ...work, updatedAt: new Date().toISOString() }
  } else {
    works.push({ ...work, order: works.length, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }
  await setJSON(KEYS.works, works)
}

export async function deleteWork(id: string): Promise<void> {
  const works = await getWorks()
  await setJSON(KEYS.works, works.filter((w) => w.id !== id))
}

export async function reorderWorks(ids: string[]): Promise<DbWorkItem[]> {
  const works = await getWorks()
  const map = new Map(works.map((w) => [w.id, w]))
  const ordered: DbWorkItem[] = ids
    .map((id, i) => (map.has(id) ? { ...map.get(id)!, order: i } : null))
    .filter(Boolean) as DbWorkItem[]
  await setJSON(KEYS.works, ordered)
  return ordered
}

export async function seedWorksIfEmpty(seed: DbWorkItem[]): Promise<void> {
  const existing = await getWorks()
  if (existing.length === 0) {
    await setJSON(KEYS.works, seed)
  }
}

/* ============================================================
   Site config
   ============================================================ */

export async function getSiteConfig(): Promise<DbSiteConfig | null> {
  return (await getJSON(KEYS.config)) || null
}

export async function saveSiteConfig(config: DbSiteConfig): Promise<void> {
  await setJSON(KEYS.config, config)
}

/* ============================================================
   Auth codes (5-minute TTL)
   ============================================================ */

export async function saveVerificationCode(email: string, code: string): Promise<void> {
  memory[`${KEYS.code}:${email}`] = code
  const kv = await getKv()
  if (kv) {
    await kv.set(`${KEYS.code}:${email}`, code, { ex: 300 })
  }
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  const stored = await getJSON(`${KEYS.code}:${email}`)
  if (!stored || stored !== code) return false
  await delJSON(`${KEYS.code}:${email}`)
  return true
}

export async function markEmailVerified(email: string): Promise<void> {
  memory[`${KEYS.verified}:${email}`] = true
  const kv = await getKv()
  if (kv) {
    await kv.set(`${KEYS.verified}:${email}`, true, { ex: 86400 })
  }
}

export async function isEmailVerified(email: string): Promise<boolean> {
  return !!(await getJSON(`${KEYS.verified}:${email}`))
}

export const isDev = typeof process !== 'undefined' && (!process.env.VERCEL || process.env.NODE_ENV === 'development')