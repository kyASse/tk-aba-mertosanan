// app/admin/akademik/prestasi/edit/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updatePrestasiAction } from "../../../actions";

type EditPageProps = { params: { id: string } };

export default async function EditPrestasiPage({ params }: EditPageProps) {
    const supabase = await createClient();
    const prestasiId = parseInt(params.id, 10);

    const { data: prestasi } = await supabase
        .from('prestasi')
        .select('*')
        .eq('id', prestasiId)
        .single();
    
    if (!prestasi) return redirect('/admin/akademik');

    const actionWithId = updatePrestasiAction.bind(null, prestasi.id);

    return (
        <div>
            <h1>Edit Prestasi</h1>
            <Link href="/admin/akademik">Kembali</Link>
            <hr />
            <form action={actionWithId} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                <div>
                    <label htmlFor="tahun">Tahun</label>
                    <input id="tahun" name="tahun" type="number" defaultValue={prestasi.tahun || ''} required />
                </div>
                <div>
                    <label htmlFor="nama_prestasi">Nama Prestasi/Lomba</label>
                    <input id="nama_prestasi" name="nama_prestasi" type="text" defaultValue={prestasi.nama_prestasi || ''} required />
                </div>
                <div>
                    <label htmlFor="tingkat">Tingkat</label>
                    <input id="tingkat" name="tingkat" type="text" defaultValue={prestasi.tingkat || ''} required />
                </div>
                <div>
                    <label htmlFor="deskripsi">Deskripsi (Opsional)</label>
                    <textarea id="deskripsi" name="deskripsi" rows={4} defaultValue={prestasi.deskripsi || ''} />
                </div>
                <button type="submit">Simpan Perubahan</button>
            </form>
        </div>
    );
}