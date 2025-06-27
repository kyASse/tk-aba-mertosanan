'use client';

import { useTransition } from 'react';
import { acceptAndCreatePortalAccountAction } from '../../actions';

type PendaftarData = {
    id: string;
    nama_lengkap: string | null;
    email: string | null;
};

type Props = {
    pendaftar: PendaftarData;
};

export default function ProcessRegistrationButton({ pendaftar }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleProcess = () => {
        if (!confirm(`Anda akan MENERIMA pendaftar ini dan MEMBUAT AKUN PORTAL untuk ${pendaftar.email}. Lanjutkan?`)) {
            return;
        }

        startTransition(async () => {
            const result = await acceptAndCreatePortalAccountAction(pendaftar);
            if (!result.success) {
                alert(`PROSES GAGAL: ${result.message}`);
            } else {
                alert(result.message);
            }
        });
    };

    return (
        <button onClick={handleProcess} disabled={isPending} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 15px', fontSize: '16px' }}>
            {isPending ? 'Memproses...' : '✅ Terima & Buatkan Akun Portal'}
        </button>
    );
}