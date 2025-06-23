// app/admin/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/logout-button"
import Link from "next/link"

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Selamat Datang, {profile?.nama_lengkap || user.email}!</h1>
          <p>Peran Anda: {profile?.role}</p>
        </div>
        <LogoutButton />
      </div>
      
      <hr />

      <h2>Menu Manajemen Konten</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '1rem' }}>
            <Link href="/admin/berita">
              <button style={{ width: '200px', padding: '10px' }}>Kelola Berita</button>
            </Link>
          </li>
          <li style={{ marginBottom: '1rem' }}>
              <Link href="/admin/pendaftar">
                  <button style={{ width: '200px', padding: '10px' }}>Kelola Pendaftar</button>
              </Link>
          </li>
          <li style={{ marginBottom: '1rem' }}>
              <Link href="/admin/galeri">
                  <button style={{ width: '200px', padding: '10px' }}>Kelola Galeri</button>
              </Link>
          </li>
          <li style={{ marginBottom: '1rem' }}>
              <Link href="/admin/testimoni">
                  <button style={{ width: '200px', padding: '10px' }}>Kelola Testimoni</button>
              </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}