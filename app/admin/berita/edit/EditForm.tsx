// app/admin/berita/edit/EditForm.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { updateBeritaAction } from '../actions'; // Kita akan buat action ini selanjutnya

// Tipe untuk data awal berita
type BeritaData = {
    id: number;
    judul: string;
    ringkasan: string;
    isi_lengkap: string;
    image_url: string;
};

export default function EditForm({ berita }: { berita: BeritaData }) {
    // Isi state dengan data awal dari props
    const [judul, setJudul] = useState(berita.judul);
    const [ringkasan, setRingkasan] = useState(berita.ringkasan);
    const [isiLengkap, setIsiLengkap] = useState(berita.isi_lengkap);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Panggil server action untuk update
            const result = await updateBeritaAction(berita.id, {
                judul,
                ringkasan,
                isi_lengkap: isiLengkap,
            });

            if (!result.success) {
                throw new Error(result.message);
            }

            alert('Berita berhasil diperbarui!');
            router.push('/admin/berita');
            router.refresh();
        } catch (err: any) {
            setError('Gagal memperbarui berita: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            {/* Tampilkan gambar saat ini */}
            <div>
                <label>Gambar Saat Ini</label>
                <img src={berita.image_url} alt={berita.judul} width={200} style={{ border: '1px solid #ccc', padding: '4px' }}/>
                <p><small>Untuk mengubah gambar, hapus berita ini dan buat yang baru.</small></p>
            </div>

            <div>
                <label htmlFor="judul">Judul</label>
                <input id="judul" type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required style={{ width: '100%' }} />
            </div>
            <div>
                <label htmlFor="ringkasan">Ringkasan</label>
                <textarea id="ringkasan" value={ringkasan} onChange={(e) => setRingkasan(e.target.value)} required style={{ width: '100%' }} />
            </div>
            <div>
                <label htmlFor="isiLengkap">Isi Lengkap</label>
                <textarea id="isiLengkap" value={isiLengkap} onChange={(e) => setIsiLengkap(e.target.value)} rows={10} required style={{ width: '100%' }} />
            </div>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <button type="submit" disabled={isLoading} style={{ padding: '10px' }}>
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
        </form>
    );
}