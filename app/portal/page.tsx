// app/portal/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";

export default async function PortalPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    // 1. Ambil data siswa yang terhubung dengan akun orang tua ini
    const { data: siswa, error: siswaError } = await supabase
        .from('siswa')
        .select('id, nama_lengkap, kelompok')
        .eq('profile_orang_tua_id', user.id);
    
    if (siswaError) console.error("Error mengambil data siswa:", siswaError);

    // 2. Ambil data laporan perkembangan untuk semua siswa yang terhubung
    const { data: laporan, error: laporanError } = await supabase
        .from('laporan_perkembangan')
        .select('semester, tahun_ajaran, catatan_guru, dokumen_rapor_url')
        .in('siswa_id', siswa?.map(s => s.id) || []); // Ambil laporan HANYA untuk siswa-siswa ini

    if (laporanError) console.error("Error mengambil laporan:", laporanError);
    
    return (
        <div>
            <h1>Portal Orang Tua</h1>
            <p>Selamat datang, {user.email}!</p>
            <LogoutButton />
            <hr />
            
            <h2>Data Anak Anda</h2>
            {siswa && siswa.map(s => (
                <div key={s.id}>
                    <h3>{s.nama_lengkap}</h3>
                    <p>Kelompok: {s.kelompok || 'Belum ditentukan'}</p>
                </div>
            ))}

            <h2>Laporan Perkembangan</h2>
            {laporan && laporan.length > 0 ? (
                <ul>
                    {laporan.map(l => (
                        <li key={`${l.semester}-${l.tahun_ajaran}-${l.dokumen_rapor_url}`}>
                            <strong>{l.semester} {l.tahun_ajaran}</strong>
                            <p>Catatan Guru: {l.catatan_guru}</p>
                            <a href={l.dokumen_rapor_url} target="_blank" rel="noopener noreferrer">
                                Unduh Rapor (PDF)
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Belum ada laporan perkembangan yang tersedia.</p>
            )}
        </div>
    );
}