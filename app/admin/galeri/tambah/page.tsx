// app/admin/galeri/tambah/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Daftar kategori yang bisa dipilih, sesuai desain Anda
const kategoriPilihan = [
    "Kegiatan Belajar",
    "Bermain",
    "Seni & Kreativitas",
    "Ibadah",
    "Acara Khusus"
];

export default function TambahGaleriPage() {
    const [keterangan, setKeterangan] = useState('');
    const [kategori, setKategori] = useState(kategoriPilihan[0]);
    const [gambar, setGambar] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const supabase = createClient();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!gambar) {
            setError('Silakan pilih file gambar.');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Upload gambar ke Storage
            const fileName = `${Date.now()}-${gambar.name.replace(/\s/g, '_')}`;
            const filePath = `galeri/${fileName}`; // Simpan di dalam folder 'galeri' di bucket
            const { error: uploadError } = await supabase.storage
                .from('konten-publik')
                .upload(filePath, gambar);
            if (uploadError) throw uploadError;

            // 2. Dapatkan URL publik gambar
            const { data: { publicUrl } } = supabase.storage
                .from('konten-publik')
                .getPublicUrl(filePath);

            // 3. Simpan info gambar ke tabel 'galeri'
            const { error: insertError } = await supabase
                .from('galeri')
                .insert({
                    keterangan,
                    kategori,
                    image_url: publicUrl
                });
            if (insertError) throw insertError;

            alert('Foto berhasil ditambahkan ke galeri!');
            router.push('/admin/galeri');
            router.refresh();
        } catch (err: any) {
            setError('Gagal menambahkan foto: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Tambah Foto Baru ke Galeri</h1>
            <Link href="/admin/galeri">Kembali ke Daftar Galeri</Link>
            <hr style={{ margin: '1rem 0' }} />
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                <div>
                    <label htmlFor="keterangan">Keterangan/Judul Foto</label>
                    <input id="keterangan" type="text" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="kategori">Kategori</label>
                    <select id="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)} required>
                        {kategoriPilihan.map(kat => (
                            <option key={kat} value={kat}>{kat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="gambar">Pilih File Gambar</label>
                    <input id="gambar" type="file" onChange={(e) => e.target.files && setGambar(e.target.files[0])} accept="image/png, image/jpeg" required />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Mengupload...' : 'Simpan Foto'}
                </button>
            </form>
        </div>
    );
}