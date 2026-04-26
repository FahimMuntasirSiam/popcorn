import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  const { response, user } = await updateSession(req)

  // Protect /admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    
    // Only allow specific admin email
    const adminEmail = 'fahimmuntasirsiam@gmail.com'
    if (user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
