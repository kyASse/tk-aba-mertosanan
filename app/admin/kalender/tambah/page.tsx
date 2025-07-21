// app/admin/kalender/tambah/page.tsx
'use client';
import { createKegiatanAction } from '../actions';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending}>{pending ? 'Menyimpan...' : 'Simpan Event'}</button>
}

export default function TambahKegiatanPage() {
    const [state, formAction] = useFormState(createKegiatanAction, { success: false, message: "" });
    return (
        <div>
            <h1>Tambah Event Kalender</h1>
            <Link href="/admin/kalender">Kembali</Link>
            <hr />
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                <div>
                    <label>Judul Kegiatan</label>
                    <input name="judul" required />
                </div>
                <div>
                    <label>Tanggal</label>
                    <input name="tanggal" type="date" required />
                </div>
                <div>
                    <label>Waktu (Opsional)</label>
                    <input name="waktu" type="time" />
                </div>
                <div>
                    <label>Kategori</label>
                    <select name="kategori" required>
                        <option value="Kegiatan">Kegiatan</option>
                        <option value="Libur">Libur</option>
                        <option value="Ujian">Ujian</option>
                        <option value="Acara Khusus">Acara Khusus</option>
                    </select>
                </div>
                <div>
                    <label>Deskripsi (Opsional)</label>
                    <textarea name="deskripsi" rows={3}></textarea>
                </div>
                <input type="hidden" name="warna" value="#3b82f6" />
                {state && !state.success && <p style={{ color: 'red' }}>{state.message}</p>}
                <SubmitButton />
            </form>
        </div>
    );
}