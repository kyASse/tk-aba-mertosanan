// app/admin/pendaftar/detail/[id]/CreateAccountButton.tsx
'use client';

import { useTransition } from 'react';
import { createPortalAccountAction } from '../../actions';

// Tipe data pendaftar yang dibutuhkan oleh action
type PendaftarData = {
    id: string;
    nama_lengkap: string | null;
    email: string | null;
    // ... tambahkan properti lain jika dibutuhkan oleh action
};

type Props = {
    pendaftar: PendaftarData;
};

export default function CreateAccountButton({ pendaftar }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleCreateAccount = () => {
        // Konfirmasi sebelum melakukan aksi penting
        if (!confirm(`Anda akan membuat akun portal untuk ${pendaftar.email}. Email instruksi akan dikirim ke alamat tersebut. Lanjutkan?`)) {
            return;
        }

        startTransition(async () => {
            const result = await createPortalAccountAction(pendaftar);
            if (result.success) {
                alert(result.message); // Umpan balik sukses
            } else {
                alert(`Gagal: ${result.message}`); // Umpan balik error
            }
        });
    };

    return (
        <button onClick={handleCreateAccount} disabled={isPending}>
            {isPending ? 'Membuat Akun...' : 'Buatkan Akun Portal & Kirim Email'}
        </button>
    );
}