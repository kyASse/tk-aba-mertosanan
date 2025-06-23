// app/admin/testimoni/tambah/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TambahTestimoniPage() {
    const [nama, setNama] = useState('');
    const [status, setStatus] = useState('');
    const [isi, setIsi] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from('testimoni')
                .insert({
                    nama_orang_tua: nama,
                    status_orang_tua: status,
                    isi_testimoni: isi,
                    is_featured: isFeatured,
                });

            if (insertError) throw insertError;

            alert('Testimoni berhasil ditambahkan!');
            router.push('/admin/testimoni');
            router.refresh();
        } catch (err: any) {
            setError('Gagal menambah testimoni: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Tambah Testimoni Baru</h1>
            <Link href="/admin/testimoni">Kembali ke Manajemen Testimoni</Link>
            <hr style={{ margin: '1rem 0' }} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                <div>
                    <label htmlFor="nama">Nama Orang Tua</label>
                    <input id="nama" type="text" value={nama} onChange={(e) => setNama(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="status">Status (misal: Orang Tua Siswa TK A)</label>
                    <input id="status" type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="isi">Isi Testimoni</label>
                    <textarea id="isi" value={isi} onChange={(e) => setIsi(e.target.value)} rows={5} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input id="isFeatured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                    <label htmlFor="isFeatured">Tampilkan di halaman Beranda?</label>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : 'Simpan Testimoni'}
                </button>
            </form>
        </div>
    );
}