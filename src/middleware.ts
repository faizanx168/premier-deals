import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isRealtor = token?.role === 'REALTOR'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                        req.nextUrl.pathname.startsWith('/admin-properties') ||
                        req.nextUrl.pathname.startsWith('/inquiries') ||
                        req.nextUrl.pathname.startsWith('/settings')

    // Redirect non-admin/realtor users away from admin routes
    if (isAdminRoute && !isAdmin && !isRealtor) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Allow all authenticated users to access public routes
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin-properties/:path*',
    '/inquiries/:path*',
    '/settings/:path*'
  ]
} 