// app/admin/akademik/DeletePrestasiButton.tsx
'use client';

import { deletePrestasiAction } from './actions';
import { useTransition } from 'react';

export default function DeletePrestasiButton({ prestasiId }: { prestasiId: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus prestasi ini?')) {
            startTransition(async () => {
                await deletePrestasiAction(prestasiId);
            });
        }
    };

    return <button onClick={handleDelete} disabled={isPending}>{isPending ? '...' : 'Hapus'}</button>;
}