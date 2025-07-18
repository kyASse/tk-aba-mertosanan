// app/admin/berita/DeleteButton.tsx
'use client';

import { deleteBeritaAction } from './actions';
import { useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4 text-red-600" />
            )}
        </Button>
    );
}