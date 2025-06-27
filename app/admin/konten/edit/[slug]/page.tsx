// app/admin/konten/edit/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateKontenAction } from "@/app/admin/konten/actions";

type EditPageProps = { params: { slug: string } };

export default async function EditKontenPage({ params }: EditPageProps) {
    const supabase = await createClient();
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const { data: konten } = await supabase
        .from('konten_halaman')
        .select('*')
        .eq('slug', slug)
        .single();
    
    if (!konten) return redirect('/admin/konten');

    // Bind action dengan slug konten
    const actionWithSlug = updateKontenAction.bind(null, konten.slug);

    return (
        <div>
            <h1>Edit Konten: {konten.judul}</h1>
            <Link href="/admin/konten">Kembali ke Daftar Konten</Link>
            <hr style={{ margin: '1rem 0' }} />

            <form action={actionWithSlug} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
                <div>
                    <label htmlFor="judul">Judul Konten</label>
                    <input id="judul" name="judul" type="text" defaultValue={konten.judul || ''} required />
                </div>
                <div>
                    <label htmlFor="isi">Isi Konten</label>
                    <p>
                        <small>
                            Anda bisa menggunakan tag HTML dasar seperti {'<p>'}, {'<strong>'}, {'<ul>'}, {'<li>'}, dll.
                        </small>
                    </p>
                    <textarea id="isi" name="isi" rows={20} defaultValue={konten.isi || ''} required />
                </div>
                <button type="submit">Simpan Perubahan</button>
            </form>
        </div>
    );
}