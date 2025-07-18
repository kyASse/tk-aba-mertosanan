// app/admin/berita/tambah/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TambahBeritaPage() {
    const [judul, setJudul] = useState('');
    const [ringkasan, setRingkasan] = useState('');
    const [isiLengkap, setIsiLengkap] = useState('');
    const [gambar, setGambar] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tambahkanKeGaleri, setTambahkanKeGaleri] = useState(false);
    
    const supabase = createClient();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!gambar) {
            setError('Silakan pilih gambar untuk berita.');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Dapatkan ID admin yang sedang login
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Tidak dapat menemukan user. Silakan login ulang.");

            // 2. Upload gambar ke Storage
            const fileName = `${Date.now()}-${gambar.name.replace(/\s/g, '_')}`;
            const filePath = `berita/${fileName}`;
            const { error: uploadError } = await supabase.storage
                .from('konten-publik')
                .upload(filePath, gambar);
            if (uploadError) throw uploadError;

            // 3. Dapatkan URL publik dari gambar yang baru di-upload
            const { data: { publicUrl } } = supabase.storage
                .from('konten-publik')
                .getPublicUrl(filePath);

            // 4. Simpan data berita ke tabel 'berita'
            const { error: insertError } = await supabase
                .from('berita')
                .insert({
                    judul,
                    ringkasan,
                    isi_lengkap: isiLengkap,
                    image_url: publicUrl,
                    penulis_id: user.id,
                });
            if (insertError) throw insertError;

            if (tambahkanKeGaleri) {
                const { error: galeriError } = await supabase
                    .from('galeri')
                    .insert({
                        image_url: publicUrl,
                        keterangan: judul,
                        kategori: 'Berita', // atau kategori lain sesuai kebutuhan
                    });
                if (galeriError) throw galeriError;
            }

            alert('Berita berhasil ditambahkan!');
            router.push('/admin/berita');
            router.refresh(); 
        } catch (err) { 
            console.error('RAW ERROR OBJECT:', err); 
            if (typeof err === 'object' && err !== null && 'message' in err) {
                setError('Terjadi kesalahan: ' + (err as { message: string }).message);
            } else {
                setError('Terjadi kesalahan yang tidak diketahui: ' + String(err));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Tambah Berita Baru</h1>
            <Link href="/admin/berita">Kembali ke Daftar Berita</Link>
            <hr style={{ margin: '1rem 0' }} />
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                <div>
                    <label htmlFor="judul">Judul</label>
                    <input id="judul" type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required style={{ width: '100%' }} />
                </div>
                <div>
                    <label htmlFor="ringkasan">Ringkasan</label>
                    <textarea id="ringkasan" value={ringkasan} onChange={(e) => setRingkasan(e.target.value)} required style={{ width: '100%' }} />
                </div>
                <div>
                    <label htmlFor="isiLengkap">Isi Lengkap (bisa menggunakan Markdown)</label>
                    <textarea id="isiLengkap" value={isiLengkap} onChange={(e) => setIsiLengkap(e.target.value)} rows={10} required style={{ width: '100%' }} />
                </div>
                <div>
                    <label htmlFor="gambar">Gambar Utama</label>
                    <input id="gambar" type="file" onChange={(e) => e.target.files && setGambar(e.target.files[0])} accept="image/png, image/jpeg" required />
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={tambahkanKeGaleri}
                            onChange={e => setTambahkanKeGaleri(e.target.checked)}
                            style={{ marginRight: '8px' }}
                        />
                        Tambahkan foto dan judul ke galeri
                    </label>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isLoading} style={{ padding: '10px' }}>
                    {isLoading ? 'Menyimpan...' : 'Simpan Berita'}
                </button>
            </form>
        </div>
    );
}