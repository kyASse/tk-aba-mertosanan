// app/admin/galeri/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from 'next/image';
// Kita akan buat komponen DeleteImageButton selanjutnya
import DeleteImageButton from "./DeleteImageButton"; 

type GaleriItem = {
    id: number;
    image_url: string;
    keterangan: string | null;
    kategori: string | null;
};

export default async function KelolaGaleriPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: galeri, error } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching galeri:', error);
        return <p>Gagal memuat data galeri.</p>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Manajemen Galeri</h1>
                <Link href="/admin/galeri/tambah">
                    <button>+ Tambah Foto Baru</button>
                </Link>
            </div>
            <Link href="/admin">Kembali ke Dasbor</Link>
            <hr style={{ margin: '1rem 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {galeri && galeri.length > 0 ? (
                    galeri.map((item: GaleriItem) => (
                        <div key={item.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                            <Image src={item.image_url} alt={item.keterangan || 'Gambar Galeri'} width={250} height={250} style={{ objectFit: 'cover', width: '100%', height: '200px', marginBottom: '1rem' }} />
                            <p><strong>{item.keterangan}</strong></p>
                            <p><small>Kategori: {item.kategori}</small></p>
                            <DeleteImageButton galeriId={item.id} imageUrl={item.image_url} />
                            <button disabled>Hapus</button> 
                        </div>
                    ))
                ) : (
                    <p>Galeri masih kosong. Silakan tambahkan foto baru.</p>
                )}
            </div>
        </div>
    );
}