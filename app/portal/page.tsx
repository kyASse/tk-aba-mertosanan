// app/portal/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, FileText, Megaphone, HandCoins, MessageSquareQuote } from "lucide-react";

type Siswa = { id: string; nama_lengkap: string; kelompok: string | null };
type Laporan = { semester: string; tahun_ajaran: string; catatan_guru: string | null; dokumen_rapor_url: string | null };

export default async function PortalPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: siswa } = await supabase
        .from('siswa')
        .select('id, nama_lengkap, kelompok')
        .eq('profile_orang_tua_id', user.id);

    const siswaUtama: Siswa | undefined = siswa?.[0];
    const siswaIds = (siswa || []).map(s => s.id);

    const { data: laporan } = await supabase
        .from('laporan_perkembangan')
        .select('semester, tahun_ajaran, catatan_guru, dokumen_rapor_url')
        .in('siswa_id', siswaIds.length ? siswaIds : ['__none__'])
        .order('tahun_ajaran', { ascending: false });

    const laporanTerbaru: Laporan | undefined = laporan?.[0];

    // Placeholder jadwal/agenda hari ini (bisa dihubungkan ke kalender_akademik)
    const jadwalHariIni = {
        label: 'Jadwal Hari Ini',
        keterangan: 'Kegiatan Berikutnya: Membaca Cerita'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
                {/* Enhanced Header with Gradient Background */}
                <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 md:p-8 text-white shadow-xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 space-y-3">
                        <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                            Selamat Datang Kembali, <span className="text-blue-200">{siswaUtama ? 'Orang Tua' : user.email}</span>!
                        </h1>
                        <p className="text-blue-100 text-sm md:text-lg max-w-3xl">
                            Berikut ringkasan perkembangan {siswaUtama ? siswaUtama.nama_lengkap : 'anak'} serta informasi terbaru dari TK ABA Mertosanan.
                        </p>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
                </header>

                {/* Enhanced Student Info Card with Modern Design */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Student Info - Takes 2 columns */}
                    <div className="md:col-span-2">
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
                            <div className="relative p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Informasi Akademik Anak</h3>
                                        <p className="text-gray-500">Data terkini siswa</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-sm text-gray-600">Nama:</span>
                                        <span className="font-medium text-gray-900">{siswaUtama?.nama_lengkap || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <span className="text-sm text-gray-600">Kelas:</span>
                                        <span className="font-medium text-gray-900">{siswaUtama?.kelompok || 'Belum ditentukan'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Schedule - Takes 1 column */}
                    <div className="md:col-span-1">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <CalendarDays className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-xl">{jadwalHariIni.label}</h3>
                                </div>
                                
                                {/* Enhanced Activity Display */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                                        <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">Kegiatan Selanjutnya</span>
                                    </div>
                                    <div className="text-white font-semibold text-lg leading-tight mb-2">
                                        Membaca Cerita
                                    </div>
                                    <div className="flex items-center gap-2 text-amber-100 text-sm">
                                        <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
                                            <span className="text-xs">⏰</span>
                                        </div>
                                        <span>Dimulai dalam 30 menit</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Enhanced Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-orange-300/20 rounded-full blur-lg"></div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Action Cards Grid */}
                <div className="grid md:grid-cols-1 gap-6">
                    {/* Lihat Laporan Terbaru */}
                    <Link href="/portal/laporan" className="group">
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Lihat Laporan Terbaru</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {laporanTerbaru ? `Terakhir Diperbarui: ${laporanTerbaru.tahun_ajaran}` : 'Belum ada laporan.'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium group-hover:bg-blue-100 transition-colors">
                                        Lihat Laporan
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Pengumuman Terbaru */}
                    <Link href="/portal/pengumuman" className="group">
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
                                            <Megaphone className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">Pengumuman Terbaru</h3>
                                            <p className="text-sm text-gray-500 mt-1">Acara Mendatang: Pertemuan Orang Tua & Guru</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium group-hover:bg-rose-100 transition-colors">
                                        Baca Selengkapnya
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Informasi Pembayaran */}
                    <Link href="/portal/keuangan" className="group">
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                            <HandCoins className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Informasi Pembayaran</h3>
                                            <p className="text-sm text-gray-500 mt-1">Informasi terbaru mengenai tagihan dan riwayat pembayaran.</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium group-hover:bg-emerald-100 transition-colors">
                                        Lihat Selengkapnya
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Bagikan Pengalaman Anda */}
                    <Link href="/portal/testimoni" className="group">
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                                            <MessageSquareQuote className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Bagikan Pengalaman Anda</h3>
                                            <p className="text-sm text-gray-500 mt-1">Kami menghargai setiap masukan Anda</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-amber-50 text-amber-600 text-sm font-medium group-hover:bg-amber-100 transition-colors">
                                        Tulis Testimoni
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}