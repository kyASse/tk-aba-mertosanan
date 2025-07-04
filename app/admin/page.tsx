// app/admin/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/logout-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('nama_lengkap, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 w-full max-w-5xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1 animate-fade-in">
              Selamat Datang, {profile?.nama_lengkap || user.email}!
            </h1>
            <p className="text-gray-600">Peran Anda: <span className="font-semibold">{profile?.role}</span></p>
          </div>
          <LogoutButton />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
          <h2 className="text-xl font-semibold mb-6 text-center">Menu Manajemen Konten</h2>
          <nav>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li>
                <Link href="/admin/berita">
                  <Button className="w-full transition-transform duration-200 hover:scale-105 hover:bg-orange-500">
                    Kelola Berita
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/admin/pendaftar">
                  <Button className="w-full transition-transform duration-200 hover:scale-105 hover:bg-orange-500">
                    Kelola Pendaftar
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/admin/galeri">
                  <Button className="w-full transition-transform duration-200 hover:scale-105 hover:bg-orange-500">
                    Kelola Galeri
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/admin/testimoni">
                  <Button className="w-full transition-transform duration-200 hover:scale-105 hover:bg-orange-500">
                    Kelola Testimoni
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/admin/konten">
                  <Button className="w-full transition-transform duration-200 hover:scale-105 hover:bg-orange-500">
                    Kelola Konten Halaman
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/admin/akademik">
                  <Button className="w-full transition-transform duration-200 hover:scale-105 hover:bg-orange-500">
                    Kelola Akademik (Biaya & Prestasi)
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </main>
      <footer className="w-full bg-gray-200 text-gray-600 text-center py-4 mt-auto border-t">
        &copy; {new Date().getFullYear()} TK ABA Mertosanan. All rights reserved.
      </footer>
    </div>
  )
}