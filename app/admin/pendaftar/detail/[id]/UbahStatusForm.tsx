// app/admin/pendaftar/detail/[id]/UbahStatusForm.tsx
'use client';
import { useState } from 'react';
import { updateStatusPendaftaranAction } from '../../actions';

type Props = {
    pendaftarId: string;
    statusSaatIni: string | null;
};

export default function UbahStatusForm({ pendaftarId, statusSaatIni }: Props) {
    const [status, setStatus] = useState(statusSaatIni || '');

    // Buat form action yang menerima FormData dan memanggil updateStatusPendaftaranAction
    async function action(formData: FormData) {
        await updateStatusPendaftaranAction(pendaftarId, formData);
    }

    return (
        <form action={action}>
            <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
            </select>
            <button type="submit">Simpan Status</button>
        </form>
    );
}