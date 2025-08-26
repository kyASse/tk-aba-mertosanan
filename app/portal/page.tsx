// app/portal/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, FileText, Megaphone, HandCoins, MessageSquareQuote } from "lucide-react";

type Siswa = { id: string; nama_lengkap: string; kelompok: string | null };
type Laporan = { id: number; semester: string; tahun_ajaran: string; catatan_guru: string | null; dokumen_rapor_url: string | null };

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
        .select('id, semester, tahun_ajaran, catatan_guru, dokumen_rapor_url')
        .in('siswa_id', siswaIds.length ? siswaIds : ['__none__'])
        .order('tahun_ajaran', { ascending: false });

    const laporanTerbaru: Laporan | undefined = laporan?.[0];

    // Placeholder jadwal/agenda hari ini (bisa dihubungkan ke kalender_akademik)
    const jadwalHariIni = {
        label: 'Jadwal Hari Ini',
        keterangan: 'Kegiatan Berikutnya: Membaca Cerita'
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Selamat Datang Kembali, <span className="text-blue-600">{siswaUtama ? 'Orang Tua' : user.email}</span>!
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                    Berikut ringkasan perkembangan {siswaUtama ? siswaUtama.nama_lengkap : 'anak'} serta informasi terbaru dari TK ABA Mertosanan.
                </p>
            </header>

            <section className="grid gap-4">
                {/* Kartu Informasi Akademik Anak + Jadwal */}
                <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border bg-card">
                    <div className="flex-1 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">👤</span>
                        </div>
                        <div>
                            <div className="font-medium">Informasi Akademik Anak</div>
                            <div className="text-sm text-muted-foreground">
                                Nama: {siswaUtama?.nama_lengkap || '-'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Kelas: {siswaUtama?.kelompok || 'Belum ditentukan'}
                            </div>
                        </div>
                    </div>
                    <div className="md:w-80 p-4 rounded-lg border bg-amber-50">
                        <div className="flex items-center gap-2 text-amber-900 font-medium">
                            <CalendarDays className="w-4 h-4" /> {jadwalHariIni.label}
                        </div>
                        <div className="text-sm text-amber-900 mt-1">
                            {jadwalHariIni.keterangan}
                        </div>
                    </div>
                </div>

                {/* Lihat Laporan Terbaru */}
                                <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
                                        <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                        <div className="font-medium">Lihat Laporan Terbaru</div>
                                                        <div className="text-xs text-muted-foreground">
                                                                {laporanTerbaru ? `Terakhir Diperbarui: ${laporanTerbaru.tahun_ajaran}` : 'Belum ada laporan.'}
                                                        </div>
                                                </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                                <Link href="/portal/laporan" className="px-3 py-1.5 rounded-md border text-sm hover:bg-accent/50 transition">
                                                    Lihat Laporan
                                                </Link>
                                                {laporanTerbaru?.dokumen_rapor_url && (
                                                    <a href={`/api/rapor/${laporan?.[0]?.id}/download`} className="px-3 py-1.5 rounded-md border text-sm hover:bg-accent/50 transition" target="_blank" rel="noopener noreferrer">
                                                        Unduh Terbaru
                                                    </a>
                                                )}
                                        </div>
                                </div>

                {/* Pengumuman Terbaru */}
                <Link href="/portal/pengumuman" className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Megaphone className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                            <div className="font-medium">Pengumuman Terbaru</div>
                            <div className="text-xs text-muted-foreground">Acara Mendatang: Pertemuan Orang Tua & Guru</div>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md border text-sm">Baca Selengkapnya</button>
                </Link>

                {/* Informasi Pembayaran */}
                <Link href="/portal/keuangan" className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <HandCoins className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <div className="font-medium">Informasi Pembayaran</div>
                            <div className="text-xs text-muted-foreground">Informasi terbaru mengenai tagihan dan riwayat pembayaran.</div>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md border text-sm">Lihat Selengkapnya</button>
                </Link>

                {/* Bagikan Pengalaman Anda */}
                <Link href="/portal/testimoni" className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <MessageSquareQuote className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <div className="font-medium">Bagikan Pengalaman Anda</div>
                            <div className="text-xs text-muted-foreground">Kami menghargai setiap masukan Anda</div>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md border text-sm">Tulis Testimoni</button>
                </Link>
            </section>
        </div>
    );
}