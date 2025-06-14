// app/admin/berita/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteButton from './DeleteButton'; 

type Berita = {
    id: number;
    judul: string;
    tanggal_terbit: string;
    image_url: string;
};

export default async function KelolaBeritaPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/auth/login');
    }

    const { data: berita, error } = await supabase
        .from('berita')
        .select('id, judul, tanggal_terbit, image_url') 
        .order('tanggal_terbit', { ascending: false });

    if (error) {
        console.error('Error fetching berita:', error);
        return <p>Gagal memuat data berita. Cek konsol server untuk detail.</p>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Manajemen Berita</h1>
                <Link href="/admin/berita/tambah">
                    <button>+ Tambah Berita Baru</button>
                </Link>
            </div>
            <Link href="/admin">Kembali ke Dasbor</Link>
            <hr style={{ margin: '1rem 0' }} />

            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', paddingRight: '2rem' }}>Judul</th>
                        <th style={{ textAlign: 'left', paddingRight: '2rem' }}>Tanggal Terbit</th>
                        <th style={{ textAlign: 'left' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {berita && berita.length > 0 ? (
                        berita.map((item: Berita) => (
                            <tr key={item.id}>
                                <td>{item.judul}</td>
                                <td>{new Date(item.tanggal_terbit).toLocaleDateString('id-ID')}</td>
                                <td>
                                    <Link href={`/admin/berita/edit/${item.id}`}>Edit</Link>
                                    {' | '}
                                    {/* PERUBAHAN UTAMA: Ganti <button> dengan <DeleteButton> */}
                                    <DeleteButton beritaId={item.id} imageUrl={item.image_url} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>Belum ada berita. Silakan tambahkan berita baru.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}