// app/admin/berita/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteButton from './DeleteButton';

type Berita = {
    id: number;
    judul: string;
    tanggal_terbit: string;
    image_url: string;
};

export default async function KelolaBeritaPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/auth/login');
    }

    const { data: berita, error } = await supabase
        .from('berita')
        .select('id, judul, tanggal_terbit, image_url')
        .order('tanggal_terbit', { ascending: false });

    if (error) {
        console.error('Error fetching berita:', error);
        return <p>Gagal memuat data berita. Cek konsol server untuk detail.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Manajemen Berita</h1>
                <Link href="/admin/berita/tambah">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded transition">
                        + Tambah Berita Baru
                    </button>
                </Link>
            </div>
            <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
                &larr; Kembali ke Dasbor
            </Link>
            <hr className="my-4" />

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left px-4 py-2">Judul</th>
                            <th className="text-left px-4 py-2">Tanggal Terbit</th>
                            <th className="text-left px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {berita && berita.length > 0 ? (
                            berita.map((item: Berita) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 font-medium flex items-center gap-3">
                                        {item.image_url && (
                                            <img
                                                src={item.image_url}
                                                alt={item.judul}
                                                className="w-12 h-12 object-cover rounded shadow"
                                            />
                                        )}
                                        {item.judul}
                                    </td>
                                    <td className="px-4 py-2">
                                        {new Date(item.tanggal_terbit).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Link href={`/admin/berita/edit/${item.id}`}>
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition">
                                                Edit
                                            </button>
                                        </Link>
                                        <DeleteButton beritaId={item.id} imageUrl={item.image_url} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-8 text-gray-500">
                                    Belum ada berita. Silakan tambahkan berita baru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}