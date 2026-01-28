import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // For now, we'll implement basic protection
    // In production, integrate with Supabase Auth

    const { pathname } = request.nextUrl

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        // Check for auth cookie/token
        const authToken = request.cookies.get('sb-access-token')

        if (!authToken) {
            // Redirect to login page
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
