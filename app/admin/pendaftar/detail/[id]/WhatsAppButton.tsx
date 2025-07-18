// app/admin/pendaftar/detail/[id]/WhatsAppButton.tsx
'use client';

type Props = {
    namaOrangTua: string | null;
    namaAnak: string | null;
    nomorTelepon: string | null;
};

export default function WhatsAppButton({ namaOrangTua, namaAnak, nomorTelepon }: Props) {
    if (!nomorTelepon) {
        return <button disabled>Nomor WA tidak tersedia</button>;
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
        // Menggunakan <a> tag agar user bisa melihat linknya jika ingin (good practice)
        <a 
            href={waUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition font-semibold inline-flex items-center gap-2"
        >
            {/* SVG Ikon WhatsApp */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.651 4.383 1.803 6.22l-1.072 3.916 4.06-1.066z"/>
            </svg>
            Kirim Konfirmasi via WA Web
        </a>
    );
}