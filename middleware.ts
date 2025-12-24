import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Skip auth check for login page
  if (request.nextUrl.pathname === '/admin/login') {
    // Add header to indicate this is the login page
    response.headers.set('x-is-login-page', 'true');
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/products')) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Protect enquiries API routes (GET, PATCH, DELETE require auth, POST is public)
  if (request.nextUrl.pathname.startsWith('/api/enquiries')) {
    const method = request.method;
    // Allow POST (public), protect GET, PATCH, DELETE
    if (method !== 'POST' && !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/products/:path*',
    '/api/enquiries/:path*',
  ],
};

