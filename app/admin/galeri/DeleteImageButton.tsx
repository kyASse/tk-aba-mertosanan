// app/admin/galeri/DeleteImageButton.tsx
'use client';

import { useTransition } from 'react';
import { deleteGaleriAction } from './actions';

type Props = {
    galeriId: number;
    imageUrl: string;
};

export default function DeleteImageButton({ galeriId, imageUrl }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Anda yakin ingin menghapus foto ini dari galeri?')) {
            startTransition(async () => {
                const result = await deleteGaleriAction(galeriId, imageUrl);
                if (!result.success) alert(result.message);
            });
        }
    };

    return (
        <button onClick={handleDelete} disabled={isPending} style={{ backgroundColor: '#dc3545', color: 'white' }}>
            {isPending ? 'Menghapus...' : 'Hapus'}
        </button>
    );
}