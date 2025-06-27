// app/admin/konten/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type KontenItem = {
    id: number;
    slug: string;
    judul: string | null;
    updated_at: string;
};

export default async function KelolaKontenPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: konten, error } = await supabase
        .from('konten_halaman')
        .select('id, slug, judul, updated_at')
        .order('judul', { ascending: true });

    if (error) {
        console.error('Error fetching konten:', error);
        return <p>Gagal memuat data konten halaman.</p>;
    }

    return (
        <div>
            <h1>Manajemen Konten Halaman</h1>
            <p>Pilih konten di bawah ini untuk diubah isinya.</p>
            <Link href="/admin">Kembali ke Dasbor</Link>
            <hr style={{ margin: '1rem 0' }} />

            <table>
                <thead>
                    <tr>
                        <th>Judul Konten</th>
                        <th>Terakhir Diperbarui</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {konten && konten.length > 0 ? (
                        konten.map((item: KontenItem) => (
                            <tr key={item.id}>
                                <td>
                                    <strong>{item.judul}</strong>
                                    <br />
                                    <small>Slug: {item.slug}</small>
                                </td>
                                <td>{new Date(item.updated_at).toLocaleString('id-ID')}</td>
                                <td>
                                    <Link href={`/admin/konten/edit/${item.slug}`}>
                                        <button>Edit Konten</button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>Tidak ada konten yang bisa diedit.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}