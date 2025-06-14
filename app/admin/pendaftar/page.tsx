// app/admin/pendaftar/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Pendaftar = {
    id: string;
    nama_lengkap: string | null;
    nama_orang_tua: string | null;
    status_pendaftaran: string | null;
    created_at: string;
};

export default async function KelolaPendaftarPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: pendaftar, error } = await supabase
        .from('pendaftar')
        .select('id, nama_lengkap, nama_orang_tua, status_pendaftaran, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pendaftar:', error);
        return <p>Gagal memuat data pendaftar.</p>;
    }

    return (
        <div>
            <h1>Manajemen Pendaftar Siswa Baru</h1>
            <Link href="/admin">Kembali ke Dasbor</Link>
            <hr />

            <table>
                <thead>
                    <tr>
                        <th>Nama Calon Siswa</th>
                        <th>Nama Orang Tua</th>
                        <th>Tanggal Daftar</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {pendaftar && pendaftar.length > 0 ? (
                        pendaftar.map((item: Pendaftar) => (
                            <tr key={item.id}>
                                <td>{item.nama_lengkap}</td>
                                <td>{item.nama_orang_tua}</td>
                                <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                <td>{item.status_pendaftaran}</td>
                                <td>
                                    <Link href={`/admin/pendaftar/detail/${item.id}`}>
                                        Proses Pendaftar
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>Belum ada pendaftar baru.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}