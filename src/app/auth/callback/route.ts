import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Resolve origin properly respecting proxy headers
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin

  // If Supabase returned an error in the query parameters
  if (error || errorDescription) {
    const errorMsg = encodeURIComponent(errorDescription || error || 'Authentication failed')
    const redirectTarget = next.includes('reset-password') ? '/forgot-password' : '/login'
    return NextResponse.redirect(`${origin}${redirectTarget}?error=${errorMsg}`)
  }

  const supabase = await createClient()

  // Support token_hash based verification (common for Supabase email templates)
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!verifyError) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    const errorMsg = encodeURIComponent(verifyError.message)
    const redirectTarget = next.includes('reset-password') ? '/forgot-password' : '/login'
    return NextResponse.redirect(`${origin}${redirectTarget}?error=${errorMsg}`)
  }

  // Support PKCE code exchange
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    const errorMsg = encodeURIComponent(exchangeError.message)
    const redirectTarget = next.includes('reset-password') ? '/forgot-password' : '/login'
    return NextResponse.redirect(`${origin}${redirectTarget}?error=${errorMsg}`)
  }

  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+authentication+link`)
}
