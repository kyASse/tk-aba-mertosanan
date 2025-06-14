// app/admin/berita/DeleteButton.tsx
'use client';

import { deleteBeritaAction } from './actions';
import { useTransition } from 'react';

type DeleteButtonProps = {
    beritaId: number;
    imageUrl: string;
};

export default function DeleteButton({ beritaId, imageUrl }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini secara permanen?')) {
            startTransition(async () => {
                const result = await deleteBeritaAction(beritaId, imageUrl);
                if (!result.success) {
                    alert(result.message);
                }
            });
        }
    };

    return (
        <button onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Menghapus...' : 'Hapus'}
        </button>
    );
}