import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request: { headers: request.headers } });
    
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: any) {
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: any) {
                    response.cookies.set({ name, value: '', ...options })
                }
            }
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role;
        const pathname = request.nextUrl.pathname;

        if (role === 'admin' && !pathname.startsWith('/admin')) {
            if (pathname !== '/auth/login') return NextResponse.redirect(new URL('/admin', request.url));
        } else if (role === 'orang_tua' && !pathname.startsWith('/portal')) {
            if (pathname !== '/auth/login') return NextResponse.redirect(new URL('/portal', request.url));
        }
    }

    if (!user) {
        if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/portal')) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }
    
    return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
}