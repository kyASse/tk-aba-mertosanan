// app/admin/testimoni/DeleteTestimoniButton.tsx
'use client';

import { deleteTestimoniAction } from './actions';
import { useTransition } from 'react';

export default function DeleteTestimoniButton({ testimoniId }: { testimoniId: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
            startTransition(async () => {
                const result = await deleteTestimoniAction(testimoniId);
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