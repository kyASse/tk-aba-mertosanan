// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

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
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // 1. Proteksi Halaman yang Memerlukan Login
    if (!user) {
        // Jika tidak ada user, dan mencoba akses /admin atau /portal, lempar ke login
        if (pathname.startsWith('/admin') || pathname.startsWith('/portal')) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // 2. Logika Redirect SETELAH Login Berdasarkan Role
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role;
        if (role === 'orang_tua' && !pathname.startsWith('/portal') && !pathname.startsWith('/api')) {
            // Arahkan 'orang_tua' kembali ke portal mereka jika mereka mencoba "keluar"
            return NextResponse.redirect(new URL('/portal', request.url));
        }
    }
    
    return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}