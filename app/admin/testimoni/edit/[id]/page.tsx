// app/admin/testimoni/edit/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateTestimoniAction } from "../../actions"; // Kita akan buat action ini

type EditPageProps = { params: { id: string } };

export default async function EditTestimoniPage({ params }: EditPageProps) {
    const supabase = await createClient();
    const testimoniId = parseInt(params.id, 10);

    const { data: testimoni } = await supabase
        .from('testimoni')
        .select('*')
        .eq('id', testimoniId)
        .single();
    
    if (!testimoni) return redirect('/admin/testimoni');

    // Bind action dengan ID testimoni
    const actionWithId = updateTestimoniAction.bind(null, testimoni.id);

    return (
        <div>
            <h1>Edit Testimoni</h1>
            <Link href="/admin/testimoni">Kembali ke Manajemen Testimoni</Link>
            <hr style={{ margin: '1rem 0' }} />

            <form action={actionWithId} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                <div>
                    <label htmlFor="nama">Nama Orang Tua</label>
                    <input id="nama" name="nama_orang_tua" type="text" defaultValue={testimoni.nama_orang_tua || ''} required />
                </div>
                <div>
                    <label htmlFor="status">Status</label>
                    <input id="status" name="status_orang_tua" type="text" defaultValue={testimoni.status_orang_tua || ''} required />
                </div>
                <div>
                    <label htmlFor="isi">Isi Testimoni</label>
                    <textarea id="isi" name="isi_testimoni" rows={5} defaultValue={testimoni.isi_testimoni || ''} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input id="isFeatured" name="is_featured" type="checkbox" defaultChecked={testimoni.is_featured || false} />
                    <label htmlFor="isFeatured">Tampilkan di halaman Beranda?</label>
                </div>
                <button type="submit">Simpan Perubahan</button>
            </form>
        </div>
    );
}