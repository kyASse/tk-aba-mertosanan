// app/admin/akademik/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeletePrestasiButton from "./DeletePrestasiButton"

type BiayaItem = { id: number; komponen_biaya: string | null; biaya_putra: number | null; biaya_putri: number | null; };
type PrestasiItem = { id: number; tahun: number | null; nama_prestasi: string | null; tingkat: string | null; };

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Daftar Prestasi Sekolah</h2>
                    <Link href="/admin/akademik/prestasi/tambah">
                        <button>+ Tambah Prestasi</button>
                    </Link>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Tahun</th>
                            <th>Nama Prestasi</th>
                            <th>Tingkat</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prestasi?.map((item: PrestasiItem) => (
                            <tr key={item.id}>
                                <td>{item.tahun}</td>
                                <td>{item.nama_prestasi}</td>
                                <td>{item.tingkat}</td>
                                <td style={{ display: 'flex', gap: '10px' }}>
                                    <Link href={`/admin/akademik/prestasi/edit/${item.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <DeletePrestasiButton prestasiId={item.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}