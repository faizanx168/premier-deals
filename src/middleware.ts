import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                        req.nextUrl.pathname.startsWith('/admin-properties') ||
                        req.nextUrl.pathname.startsWith('/inquiries')

    // Redirect non-admin users away from admin routes
    if (isAdminRoute && !isAdmin) {
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