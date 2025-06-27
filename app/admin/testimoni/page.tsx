// app/admin/testimoni/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteTestimoniButton from "./DeleteTestimoniButton"; // Komponen tombol hapus

type TestimoniItem = {
    id: number;
    nama_orang_tua: string | null;
    status_orang_tua: string | null;
    is_featured: boolean | null;
};

export default async function KelolaTestimoniPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: testimoni, error } = await supabase
        .from('testimoni')
        .select('id, nama_orang_tua, status_orang_tua, is_featured')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching testimoni:', error);
        return <p>Gagal memuat data testimoni.</p>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Manajemen Testimoni</h1>
                <Link href="/admin/testimoni/tambah">
                    <button>+ Tambah Testimoni Baru</button>
                </Link>
            </div>
            <Link href="/admin">Kembali ke Dasbor</Link>
            <hr style={{ margin: '1rem 0' }} />

            <table>
                <thead>
                    <tr>
                        <th>Nama Orang Tua</th>
                        <th>Status</th>
                        <th>Tampil di Beranda?</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {testimoni && testimoni.length > 0 ? (
                        testimoni.map((item: TestimoniItem) => (
                            <tr key={item.id}>
                                <td>{item.nama_orang_tua}</td>
                                <td>{item.status_orang_tua}</td>
                                <td>{item.is_featured ? '✅ Ya' : '❌ Tidak'}</td>
                                <td style={{ display: 'flex', gap: '10px' }}>
                                    <Link href={`/admin/testimoni/edit/${item.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <DeleteTestimoniButton testimoniId={item.id} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>Belum ada testimoni.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}