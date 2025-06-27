// app/admin/akademik/prestasi/tambah/page.tsx
'use client';

import { createPrestasiAction } from "../../actions";
import Link from "next/link";
import { useFormState } from 'react-dom';

function SubmitButton() {
    // Gunakan useFormStatus untuk mendapatkan status loading dari form
    const { pending } = require('react-dom');
    return <button type="submit" disabled={pending}>{pending ? 'Menyimpan...' : 'Simpan Prestasi'}</button>
}

export default function TambahPrestasiPage() {
    // Gunakan useFormState untuk menangani state form dari server action
    const [state, formAction] = useFormState(createPrestasiAction, { success: false, message: "" });

    return (
        <div>
            <h1>Tambah Prestasi Baru</h1>
            <Link href="/admin/akademik">Kembali ke Manajemen Akademik</Link>
            <hr />
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                <div>
                    <label htmlFor="tahun">Tahun</label>
                    <input id="tahun" name="tahun" type="number" placeholder="Contoh: 2024" required />
                </div>
                <div>
                    <label htmlFor="nama_prestasi">Nama Prestasi/Lomba</label>
                    <input id="nama_prestasi" name="nama_prestasi" type="text" required />
                </div>
                <div>
                    <label htmlFor="tingkat">Tingkat</label>
                    <input id="tingkat" name="tingkat" type="text" placeholder="Contoh: Kecamatan, Kabupaten" required />
                </div>
                <div>
                    <label htmlFor="deskripsi">Deskripsi (Opsional)</label>
                    <textarea id="deskripsi" name="deskripsi" rows={4} />
                </div>
                {state && !state.success && <p style={{ color: 'red' }}>{state.message}</p>}
                <SubmitButton />
            </form>
        </div>
    );
}