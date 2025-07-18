// app/admin/kalender/DeleteKegiatanButton.tsx
'use client';
import { deleteKegiatanAction } from './actions';
import { useTransition } from 'react';

export default function DeleteKegiatanButton({ kegiatanId }: { kegiatanId: number }) {
    const [isPending, startTransition] = useTransition();
    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus kegiatan ini?')) {
            startTransition(async () => { await deleteKegiatanAction(kegiatanId) });
        }
    };
    return <button onClick={handleDelete} disabled={isPending}>{isPending ? '...' : 'Hapus'}</button>;
}