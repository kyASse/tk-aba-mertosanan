'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const kategoriPilihan = [
    "Kegiatan Belajar",
    "Bermain",
    "Seni & Kreativitas",
    "Ibadah",
    "Acara Khusus"
];

export default function TambahGaleriPage() {
    const [keterangan, setKeterangan] = useState('');
    const [kategori, setKategori] = useState(kategoriPilihan[0]);
    const [gambar, setGambar] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!gambar) {
            setError('Silakan pilih file gambar.');
            setIsLoading(false);
            return;
        }

        try {
            const fileName = `${Date.now()}-${gambar.name.replace(/\s/g, '_')}`;
            const filePath = `galeri/${fileName}`;
            const { error: uploadError } = await supabase.storage
                .from('konten-publik')
                .upload(filePath, gambar);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('konten-publik')
                .getPublicUrl(filePath);

            const { error: insertError } = await supabase
                .from('galeri')
                .insert({
                    keterangan,
                    kategori,
                    image_url: publicUrl
                });
            if (insertError) throw insertError;

            alert('Foto berhasil ditambahkan ke galeri!');
            router.push('/admin/galeri');
            router.refresh();
        } catch (err: any) {
            setError('Gagal menambahkan foto: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Tambah Foto Galeri</h1>
                <Link href="/admin/galeri" className="text-blue-600 hover:underline">
                    &larr; Kembali ke Galeri
                </Link>
            </div>
            <hr className="my-4" />

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="keterangan" className="font-medium block mb-1">Keterangan/Judul Foto</label>
                        <input
                            id="keterangan"
                            type="text"
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="kategori" className="font-medium block mb-1">Kategori</label>
                        <select
                            id="kategori"
                            value={kategori}
                            onChange={(e) => setKategori(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                        >
                            {kategoriPilihan.map(kat => (
                                <option key={kat} value={kat}>{kat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="gambar" className="font-medium block mb-1">Pilih File Gambar</label>
                        <input
                            id="gambar"
                            type="file"
                            onChange={(e) => {
                                if (e.target.files) {
                                    const file = e.target.files[0];
                                    if (objectURL) {
                                        URL.revokeObjectURL(objectURL);
                                    }
                                    setObjectURL(URL.createObjectURL(file));
                                    setGambar(file);
                                }
                            }}
                            accept="image/png, image/jpeg"
                            required
                            className="block"
                        />
                        {gambar && (
                            <img
                                src={objectURL}
                                alt="Preview"
                                className="mt-3 max-w-xs max-h-48 rounded shadow border"
                            />
                        )}
                    </div>
                    {error && <p className="text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow hover:from-blue-600 hover:to-cyan-500 transition"
                    >
                        {isLoading ? 'Mengupload...' : 'Simpan Foto'}
                    </button>
                </form>
            </div>
        </div>
    );
}