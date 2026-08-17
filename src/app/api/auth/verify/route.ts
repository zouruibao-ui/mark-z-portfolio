import { NextRequest, NextResponse } from 'next/server'
import { verifyCode, markEmailVerified } from '@/lib/db'
import { createToken, setSessionCookie } from '@/lib/auth'

/**
 * POST /api/auth/verify
 * Verifies the 6-digit code and issues a JWT session cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const isValid = await verifyCode(email, code)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 })
    }

    await markEmailVerified(email)
    const token = await createToken(email)
    await setSessionCookie(token)

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}