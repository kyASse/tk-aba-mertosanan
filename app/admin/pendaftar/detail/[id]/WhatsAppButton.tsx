'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle, ExternalLink } from "lucide-react";

type Props = {
    namaOrangTua: string | null;
    namaAnak: string | null;
    nomorTelepon: string | null;
};

export default function WhatsAppButton({ namaOrangTua, namaAnak, nomorTelepon }: Props) {
    if (!nomorTelepon) {
        return (
            <Button variant="outline" disabled className="text-gray-500">
                <MessageCircle className="w-4 h-4 mr-2" />
                Nomor WA tidak tersedia
            </Button>
        );
    }

    // Pastikan nomor telepon dalam format internasional (misal: 62812...)
    // Menghapus spasi, tanda hubung, dan mengganti '0' di depan dengan '62'
    const formattedNomor = nomorTelepon.replace(/[\s-]/g, '').replace(/^0/, '62');

    // Template pesan
    const templatePesan = `Assalamu’alaikum Wr. Wb.,\n\nSaya, tim administrasi TK ABA Mertosanan, ingin memberikan konfirmasi bahwa kami telah menerima data pendaftaran untuk ananda *${namaAnak || '(Nama Anak)'}*.\n\nSelanjutnya, kami akan melakukan verifikasi data. Mohon ditunggu informasi berikutnya.\n\nTerima kasih.\nWassalamu’alaikum Wr. Wb.`;
    
    // Encode pesan agar aman untuk URL
    const encodedPesan = encodeURIComponent(templatePesan);

    // ===== PERUBAHAN UTAMA ADA DI SINI =====
    // Kita ganti URL dari wa.me menjadi web.whatsapp.com
    const waUrl = `https://web.whatsapp.com/send?phone=${formattedNomor}&text=${encodedPesan}`;

    return (
        <Button asChild className='bg-green-600 hover:bg-green-700 text-white'>
            <a 
                href={waUrl} 
                target='_blank' 
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2'
            >
                <MessageCircle className='w-4 h-4' />
                Kirim Konfirmasi via WA Web
                <ExternalLink className='w-3 h-3' />
            </a>
        </Button>
    );
}