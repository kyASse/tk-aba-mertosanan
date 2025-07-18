// app/admin/akademik/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeletePrestasiButton from "./DeletePrestasiButton"
import Image from "next/image";

type BiayaItem = { id: number; komponen_biaya: string | null; biaya_putra: number | null; biaya_putri: number | null; };
type PrestasiItem = { id: number; tahun: number | null; nama_siswa: string | null; nama_prestasi: string | null; tingkat: string | null; dokumentasi_url: string | null;};

export default async function KelolaAkademikPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const biayaPromise = supabase.from('biaya_pendaftaran').select('*').order('id');
    const prestasiPromise = supabase.from('prestasi').select('*').order('tahun', { ascending: false });
    const sppPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'catatan-spp').single();

    const [{ data: biaya }, { data: prestasi }, { data: catatanSpp }] = await Promise.all([biayaPromise, prestasiPromise, sppPromise]);

    const totalPutra = biaya?.reduce((acc: number, item: BiayaItem) => acc + (item.biaya_putra || 0), 0);
    const totalPutri = biaya?.reduce((acc: number, item: BiayaItem) => acc + (item.biaya_putri || 0), 0);

    return (
        <div>
            <h1>Manajemen Akademik</h1>
            <Link href="/admin">Kembali ke Dasbor</Link>
            <hr />

            {/* Bagian Manajemen Biaya */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Rincian Keuangan Anak Baru</h2>
                    <Link href="/admin/akademik/edit-biaya">
                        <button>Edit Tabel Biaya</button>
                    </Link>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Komponen Biaya</th>
                            <th>PUTRA (Rp)</th>
                            <th>PUTRI (Rp)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {biaya?.map((item: BiayaItem) => (
                            <tr key={item.id}>
                                <td>{item.komponen_biaya}</td>
                                <td>{item.biaya_putra?.toLocaleString('id-ID')}</td>
                                <td>{item.biaya_putri?.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        <tr style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
                            <td>JUMLAH</td>
                            <td>{totalPutra?.toLocaleString('id-ID')}</td>
                            <td>{totalPutri?.toLocaleString('id-ID')}</td>
                        </tr>
                    </tbody>
                </table>
                <p><strong>{catatanSpp?.isi}</strong></p>
            </section>

            <hr />

            {/* Bagian Manajemen Prestasi */}
            <section>
                <div className="min-h-screen bg-white px-8 py-6">
                    <div className="flex items-center mb-8">
                        <h1 className="text-3xl font-bold mr-4">Daftar Prestasi</h1>
                        <div className="flex-1" />
                        <Link href="/admin/akademik/prestasi/tambah">
                            <button
                                className="flex items-center gap-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold px-4 py-2 rounded-full shadow transition"
                            >
                                Tambah Prestasi Baru
                                <span className="text-xl font-bold">+</span>
                            </button>
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700">
                                    <th className="py-3 px-4 border-b">No</th>
                                    <th className="py-3 px-4 border-b">Tahun</th>
                                    <th className="py-3 px-4 border-b">Nama Siswa</th>
                                    <th className="py-3 px-4 border-b">Prestasi</th>
                                    <th className="py-3 px-4 border-b">Tingkat</th>
                                    <th className="py-3 px-4 border-b">Dokumentasi</th>
                                    <th className="py-3 px-4 border-b">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestasi && prestasi.length > 0 ? prestasi.map((item: PrestasiItem, idx: number) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 text-center">{idx + 1}.</td>
                                        <td className="py-2 px-4 text-center">{item.tahun}</td>
                                        <td className="py-2 px-4 text-center">{item.nama_siswa}</td>
                                        <td className="py-2 px-4">{item.nama_prestasi}</td>
                                        <td className="py-2 px-4 text-center">{item.tingkat}</td>
                                        <td className="py-2 px-4 text-center align-middle">
                                            {item.dokumentasi_url ? (
                                                <a href={item.dokumentasi_url} target="_blank" rel="noopener noreferrer">
                                                    <Image
                                                        src={item.dokumentasi_url}
                                                        alt="Dokumentasi"
                                                        width={40}
                                                        height={40}
                                                        className="rounded object-cover border mx-auto"
                                                    />
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 flex gap-2 justify-center">
                                            <Link href={`/admin/akademik/prestasi/edit/${item.id}`}>
                                                <button
                                                    className="bg-yellow-300 hover:bg-yellow-400 text-yellow-900 rounded p-2"
                                                    title="Edit"
                                                >
                                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#b45309" strokeWidth="2" d="M16.475 5.408a2.5 2.5 0 1 1 3.536 3.536l-9.193 9.193a4 4 0 0 1-1.414.943l-3.07 1.228a.5.5 0 0 1-.65-.65l1.228-3.07a4 4 0 0 1 .943-1.414l9.193-9.193Z"/></svg>
                                                </button>
                                            </Link>
                                            <DeletePrestasiButton prestasiId={item.id} />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="py-6 text-center text-gray-400">Belum ada data prestasi.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}