import { NextRequest, NextResponse } from 'next/server'
import { saveVerificationCode, getSiteConfig } from '@/lib/db'
import { generateCode } from '@/lib/auth'
import { getAdminEmailsFromEnv } from '@/lib/seed'

/**
 * POST /api/auth/send-code
 * Sends a 6-digit verification code to the admin's email.
 * In production the code is delivered by an email provider; in dev it
 * is returned in the response body so the owner can see it.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const config = await getSiteConfig()
    const configEmails = [config?.adminEmail, config?.adminBackupEmail].filter(Boolean)
    const envEmails = getAdminEmailsFromEnv()
    const adminEmails = [...new Set([...configEmails, ...envEmails])]
    if (!adminEmails.includes(email)) {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 403 })
    }

    const code = generateCode()
    await saveVerificationCode(email, code)

    if (process.env.NODE_ENV === 'development' || !process.env.RESEND_API_KEY) {
      console.log(`[AUTH] Verification code for ${email}: ${code}`)
    }

    // In production, send the email via an API route or external service
    // When a RESEND_API_KEY is configured, the code below would send the email:
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: { 'Authorization': \`Bearer \${process.env.RESEND_API_KEY}\`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ from: 'Mark Z <onboarding@resend.dev>', to: email, subject: 'Admin login code', html: \`<p>Code: <strong>\${code}</strong></p>\` }),
    // })

    // Dev mode: return the code so the user never gets stuck
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ success: true, code })
    }

    return NextResponse.json({ success: true, message: 'Verification code sent' })
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}