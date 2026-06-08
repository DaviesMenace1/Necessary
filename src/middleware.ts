import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = {
  '/client': ['client', 'admin'],
  '/admin': ['admin', 'designer'],
  '/installer': ['installer', 'admin'],
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Unauthenticated → redirect to /auth
  const isProtected = Object.keys(PROTECTED_ROUTES).some(r => pathname.startsWith(r))
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Authenticated on /auth → redirect to /client
  if (pathname === '/auth' && user) {
    return NextResponse.redirect(new URL('/client', request.url))
  }

  if (user) {
    // Fetch role
    const { data: roleRow } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const role = roleRow?.role

    // Role-based route guards
    for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
      if (pathname.startsWith(route) && role && !allowedRoles.includes(role)) {
        // Redirect to their appropriate portal
        const redirectMap: Record<string, string> = {
          client: '/client',
          designer: '/admin',
          admin: '/admin',
          installer: '/installer',
        }
        return NextResponse.redirect(new URL(redirectMap[role] ?? '/auth', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
