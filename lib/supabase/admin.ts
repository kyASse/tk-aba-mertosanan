// lib/supabase/admin.ts
'use server'; // Memastikan file ini hanya berjalan di lingkungan server

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createAdminClient() {
  // Menggunakan await untuk mendapatkan cookie store, konsisten dengan pola terbaru
  const cookieStore = await cookies();

  // Ambil kunci service_role dari environment variables
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error("FATAL: SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di environment variables. Fitur admin tidak akan berfungsi.");
  }

  // Buat klien Supabase, tetapi ganti auth.key dengan serviceRoleKey
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey, // Gunakan service_role key di sini!
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Blok set dan remove di sini lebih bersifat formalitas untuk SSR,
        // karena klien service_role biasanya tidak mengelola sesi cookie pengguna.
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Abaikan error jika dipanggil dari konteks read-only
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Abaikan error jika dipanggil dari konteks read-only
          }
        },
      },
      // Opsi auth ini direkomendasikan untuk klien service_role
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}