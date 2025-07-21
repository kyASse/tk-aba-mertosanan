// app/admin/kalender/tambah/page.tsx
'use client';
import { createKegiatanAction } from '../actions';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useState, useActionState } from 'react';
import { categoryColors, availableCategories } from '@/lib/constants/calendar';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending}>{pending ? 'Menyimpan...' : 'Simpan Event'}</button>
}

export default function TambahKegiatanPage() {
    const [state, formAction] = useActionState(createKegiatanAction, { success: false, message: "" });
    const [selectedKategori, setSelectedKategori] = useState(availableCategories[0] || 'Libur Umum');
    return (
        <div>
            <h1>Tambah Event Kalender</h1>
            <Link href="/admin/kalender">Kembali</Link>
            <hr />
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                <div>
                    <label>Judul Kegiatan</label>
                    <input name="judul" required defaultValue="" />
                </div>
                <div>
                    <label>Tanggal</label>
                    <input name="tanggal" type="date" required defaultValue="" />
                </div>
                <div>
                    <label>Waktu (Opsional)</label>
                    <input name="waktu" type="time" defaultValue="" />
                </div>
                <div>
                    <label>Kategori</label>
                    <select 
                        name="kategori" 
                        required 
                        value={selectedKategori}
                        onChange={(e) => setSelectedKategori(e.target.value)}
                    >
                        {availableCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {/* Preview warna yang akan digunakan */}
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                            width: '20px', 
                            height: '20px', 
                            backgroundColor: categoryColors[selectedKategori] || '#3b82f6', 
                            marginRight: '8px', 
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}></span>
                        <span style={{ fontSize: '14px', color: '#666' }}>Warna: {categoryColors[selectedKategori] || '#3b82f6'}</span>
                    </div>
                </div>
                <div>
                    <label>Deskripsi (Opsional)</label>
                    <textarea name="deskripsi" rows={3} defaultValue=""></textarea>
                </div>
                <input type="hidden" name="warna" value={categoryColors[selectedKategori] || '#3b82f6'} />
                {state && !state.success && <p style={{ color: 'red' }}>{state.message}</p>}
                <SubmitButton />
            </form>
        </div>
    );
}