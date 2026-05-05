import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options as any)
          })
        },
      },
    },
  )

  const { data: { session } } = await supabase.auth.getSession()
  const hasAuthCookie = request.cookies.getAll().some(({ name }) =>
    name.startsWith('sb-') && name.endsWith('-auth-token'),
  )
  const user = session?.user ?? (hasAuthCookie ? { id: 'cookie-auth' } : null)
  const isAuthRoute = request.nextUrl.pathname.startsWith('/signin')
    || request.nextUrl.pathname.startsWith('/signup')
    || request.nextUrl.pathname.startsWith('/reset-password')

  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
