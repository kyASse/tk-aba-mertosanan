// app/admin/kalender/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteKegiatanButton from "./DeleteKegiatanButton";

export default async function KelolaKalenderPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: kegiatan } = await supabase
        .from('kalender_akademik')
        .select('*')
        .order('tanggal', { ascending: true });

    return (
        <div>
            <h1>Manajemen Kalender Akademik</h1>
            <Link href="/admin">Kembali ke Dasbor</Link> | <Link href="/admin/kalender/tambah"><button>+ Tambah Kegiatan Baru</button></Link>
            <hr />
            <table>
                <thead>
                    <tr>
                        <th>Judul</th>
                        <th>Tanggal</th>
                        <th>Waktu</th>
                        <th>Kategori</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {kegiatan?.map(item => (
                        <tr key={item.id}>
                            <td>{item.judul}</td>
                            <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                            <td>{item.waktu || '-'}</td>
                            <td>{item.kategori}</td>
                            <td>
                                <DeleteKegiatanButton kegiatanId={item.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}