// app/galeri/page.tsx
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import FilterButtons from "./FilterButtons";

// Tipe untuk searchParams, yang bisa ada atau tidak
type GaleriPageProps = {
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function GaleriPublikPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const supabase = await createClient();

    // ✅ Await dulu sebelum mengakses
    const params = await searchParams;
    const filterKategori = params.kategori as string | undefined;

    // Buat query dasar
    let query = supabase.from('galeri').select('*').order('created_at', { ascending: false });

    // Jika ada filter kategori di URL, tambahkan ke query
    if (filterKategori) {
        query = query.eq('kategori', filterKategori);
    }

    // Eksekusi query
    const { data: galeri, error } = await query;

    if (error) {
        console.error("Error mengambil data galeri:", error);
        return <p>Gagal memuat galeri. Silakan coba lagi nanti.</p>;
    }

    // Ambil semua kategori unik untuk tombol filter
    const { data: kategoriData } = await supabase.rpc('get_unique_kategori_galeri');

    return (
        <div>
            <h1>Galeri Kegiatan</h1>

            <FilterButtons kategoriList={kategoriData || []} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                {galeri && galeri.length > 0 ? (
                    galeri.map(item => (
                        <div key={item.id}>
                            <Image src={item.image_url} alt={item.keterangan || ''} width={400} height={400} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                            <h3>{item.keterangan}</h3>
                            <p>{item.kategori}</p>
                        </div>
                    ))
                ) : (
                    <p>Tidak ada foto dalam kategori ini.</p>
                )}
            </div>
        </div>
    );
}
