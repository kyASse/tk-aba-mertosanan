// app/admin/pendaftar/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";


type Pendaftar = {
    id: string;
    nama_lengkap: string | null;
    nama_ayah_kandung: string | null;
    nama_ibu_kandung?: string | null;
    status_pendaftaran: string | null;
    created_at: string;
};

export default async function KelolaPendaftarPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: pendaftar, error } = await supabase
        .from('pendaftar')
        .select('id, nama_lengkap, nama_ayah_kandung, nama_ibu_kandung, status_pendaftaran, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pendaftar:', error);
        return <p>Gagal memuat data pendaftar.</p>;
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Manajemen Pendaftar Siswa Baru</h1>
                <Link href="/admin" className="text-blue-600 hover:underline">
                    &larr; Kembali ke Dasbor
                </Link>
            </div>
            <hr className="my-4" />

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left px-4 py-2">Nama Calon Siswa</th>
                            <th className="text-left px-4 py-2">Nama Orang Tua</th>
                            <th className="text-left px-4 py-2">Tanggal Daftar</th>
                            <th className="text-left px-4 py-2">Status</th>
                            <th className="text-left px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {pendaftar && pendaftar.length > 0 ? (
                            pendaftar.map((item: Pendaftar) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 font-medium">{item.nama_lengkap}</td>
                                    <td className="px-4 py-2">
                                        {(item.nama_ayah_kandung || "Tidak Diketahui")}/{(item.nama_ibu_kandung || "Tidak Diketahui")}
                                    </td>
                                    <td className="px-4 py-2">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${item.status_pendaftaran === "Akun Dibuat"
                                                ? "bg-green-100 text-green-700"
                                                : item.status_pendaftaran === "Diterima"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`
                                        }>
                                            {item.status_pendaftaran}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/admin/pendaftar/detail/${item.id}`}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition font-semibold"
                                        >
                                            Proses Pendaftar
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    Belum ada pendaftar baru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}