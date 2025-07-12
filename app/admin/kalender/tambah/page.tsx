// app/admin/kalender/tambah/page.tsx
'use client';
import { createKegiatanAction } from '../actions';
import Link from 'next/link';
import { useFormState } from 'react-dom';

function SubmitButton() {
    const { pending } = require('react-dom');
    return <button type="submit" disabled={pending}>{pending ? 'Menyimpan...' : 'Simpan Kegiatan'}</button>
}

export default function TambahKegiatanPage() {
    const [state, formAction] = useFormState(createKegiatanAction, { success: false, message: "" });
    return (
        <div>
            <h1>Tambah Kegiatan Baru</h1>
            <Link href="/admin/kalender">Kembali</Link>
            <hr />
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                <div>
                    <label>Nama Kegiatan</label>
                    <input name="nama_kegiatan" required />
                </div>
                <div>
                    <label>Tanggal Mulai</label>
                    <input name="tanggal_mulai" type="date" required />
                </div>
                <div>
                    <label>Tanggal Selesai (kosongkan jika hanya 1 hari)</label>
                    <input name="tanggal_selesai" type="date" />
                </div>
                <div>
                    <label>Kategori (untuk warna di kalender)</label>
                    <select name="kategori" required>
                        <option>Libur</option>
                        <option>Acara Sekolah</option>
                        <option>Peringatan</option>
                        <option>Ujian</option>
                        <option>Umum</option>
                    </select>
                </div>
                <div>
                    <label>Keterangan (Opsional)</label>
                    <textarea name="keterangan" rows={3}></textarea>
                </div>
                {state && !state.success && <p style={{ color: 'red' }}>{state.message}</p>}
                <SubmitButton />
            </form>
        </div>
    );
}