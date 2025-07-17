// app/admin/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/logout-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  Users, 
  ImageIcon, 
  MessageSquare, 
  TrendingUp,
  Edit
} from "lucide-react"

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

  // Fetch data untuk dashboard
  const { data: recentNews } = await supabase
    .from('berita')
    .select('id, judul, ringkasan, created_at')
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: pendaftarStats } = await supabase
    .from('pendaftar')
    .select('*')

  // Hitung statistik pendaftar
  const totalPendaftar = pendaftarStats?.length || 0
  const menungguPersetujuan = pendaftarStats?.filter(p => p.status === 'menunggu_persetujuan').length || 0
  const pendaftarDisetujui = pendaftarStats?.filter(p => p.status === 'diterima').length || 0
  const validasiUlang = pendaftarStats?.filter(p => p.status === 'validasi_ulang').length || 0
  const pendaftarDitolak = pendaftarStats?.filter(p => p.status === 'ditolak').length || 0

  // Debug logging
  console.log('=== ADMIN DASHBOARD DEBUG ===');
  console.log('user:', user);
  console.log('profile:', profile);
  console.log('recentNews:', recentNews);
  console.log('pendaftarStats:', pendaftarStats);
  console.log('totalPendaftar:', totalPendaftar);
  console.log('menungguPersetujuan:', menungguPersetujuan);
  console.log('pendaftarDisetujui:', pendaftarDisetujui);
  console.log('validasiUlang:', validasiUlang);
  console.log('pendaftarDitolak:', pendaftarDitolak);
  console.log('==============================');

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang, {profile?.nama_lengkap || user.email}!
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* Pembaruan Berita Terkini */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pembaruan Berita Terkini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="font-semibold text-gray-700">Judul</div>
              <div className="font-semibold text-gray-700">Ringkasasn</div>
              <div className="font-semibold text-gray-700">Tanggal</div>
            </div>
            {recentNews && recentNews.length > 0 ? (
              recentNews.map((berita) => (
                <div key={berita.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-100">
                  <div className="text-gray-900">{berita.judul}</div>
                  <div className="text-gray-600">
                    {berita.ringkasan}
                  </div>
                  <div className="text-gray-600">
                    {new Date(berita.created_at).toLocaleDateString('id-ID')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada berita terbaru
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Pendaftaran */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Status Pendaftaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-orange-100 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Total Pendaftar</h3>
              <p className="text-3xl font-bold text-orange-600">{totalPendaftar}</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Menunggu Persetujuan</h3>
              <p className="text-3xl font-bold text-blue-600">{menungguPersetujuan}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Pendaftaran Yang Disetujui</h3>
              <p className="text-3xl font-bold text-green-600">{pendaftarDisetujui}</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Validasi Ulang</h3>
              <p className="text-3xl font-bold text-yellow-600">{validasiUlang}</p>
            </div>
            <div className="bg-red-100 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Pendaftar Yang Ditolak</h3>
              <p className="text-3xl font-bold text-red-600">{pendaftarDitolak}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Akses Cepat */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Akses Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/pendaftar">
              <Button 
                variant="outline" 
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
              >
                <Users className="w-4 h-4 mr-2" />
                Kelola Pendaftaran
              </Button>
            </Link>
            <Link href="/admin/berita">
              <Button 
                variant="outline" 
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Kelola Berita
              </Button>
            </Link>
            <Link href="/admin/galeri">
              <Button 
                variant="outline" 
                className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Kelola Galeri
              </Button>
            </Link>
            <Link href="/admin/testimoni">
              <Button 
                variant="outline" 
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Kelola Testimoni
              </Button>
            </Link>
            <Link href="/admin/konten">
              <Button 
                variant="outline" 
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                Kelola Konten
              </Button>
            </Link>
            <Link href="/admin/akademik">
              <Button 
                variant="outline" 
                className="bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-300"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Kelola Akademik
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}