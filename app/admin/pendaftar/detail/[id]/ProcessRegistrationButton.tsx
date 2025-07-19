'use client';

import { useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
        // Create a promise-based confirmation using toast
        const confirmProcess = new Promise((resolve) => {
            toast("Konfirmasi Penerimaan", {
                description: `Anda akan MENERIMA pendaftar ${pendaftar.nama_lengkap} dan MEMBUAT AKUN PORTAL untuk ${pendaftar.email}. Apakah Anda yakin?`,
                action: {
                    label: "Ya, Proses",
                    onClick: () => resolve(true)
                },
                cancel: {
                    label: "Batal",
                    onClick: () => resolve(false)
                },
                duration: 10000, // Show for 10 seconds
            });
        });

        confirmProcess.then((confirmed) => {
            if (!confirmed) return;

            startTransition(async () => {
                try {
                    const result = await acceptAndCreatePortalAccountAction(pendaftar);
                    if (!result.success) {
                        toast.error("Proses Gagal", {
                            description: result.message,
                            duration: 5000
                        });
                    } else {
                        toast.success("Berhasil!", {
                            description: result.message,
                            duration: 5000
                        });
                    }
                } catch {
                    toast.error("Terjadi kesalahan", {
                        description: "Silakan coba lagi atau hubungi administrator",
                        duration: 5000
                    });
                }
            });
        });
    };

    return (
        <Button 
            onClick={handleProcess} 
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="default"
        >
            {isPending ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                </>
            ) : (
                <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Terima & Buatkan Akun Portal
                </>
            )}
        </Button>
    );
}