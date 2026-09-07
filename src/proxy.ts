import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  // Public pages (home, guest, about, terms, privacy, api, etc.) do not require auth middleware
  if (!isDashboardRoute && !isAuthRoute) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }

  // Check if any auth cookie exists before making a network call to Supabase
  const cookies = request.cookies.getAll()
  const hasAuthCookie = cookies.some(
    (c) => c.name.includes('-auth-token') || c.name.startsWith('sb-')
  )

  if (isDashboardRoute && !hasAuthCookie) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && !hasAuthCookie) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (isDashboardRoute && !user) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect from login/register if already logged in
  if (isAuthRoute && user) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
