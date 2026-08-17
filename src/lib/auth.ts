import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'mark-z-portfolio-jwt-secret-dev-only'
)

const COOKIE_NAME = 'admin_token'
const SESSION_DURATION = 24 * 60 * 60 // 24 hours

export interface AdminSession {
  email: string
  role: 'admin'
  loginAt: string
}

export async function createToken(email: string): Promise<string> {
  return new SignJWT({ email, role: 'admin', loginAt: new Date().toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as AdminSession
  } catch {
    return null
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}