// app/admin/akademik/edit-biaya/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateBiayaAction, updateCatatanSppAction } from "../actions"; 

export default async function EditBiayaPage() {
    const supabase = await createClient();
    const biayaPromise = supabase.from('biaya_pendaftaran').select('*').order('id');
    const sppPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'catatan-spp').single();

    const [{ data: biaya }, { data: catatanSpp }] = await Promise.all([biayaPromise, sppPromise]);
    
    if (!biaya) return redirect('/admin/akademik');

    return (
        <div>
            <h1>Edit Rincian Keuangan</h1>
            <Link href="/admin/akademik">Kembali</Link>
            <hr />
            
            {/* Form untuk tabel biaya */}
            <form action={updateBiayaAction}>
                <h3>Tabel Biaya Utama</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Komponen Biaya</th>
                            <th>PUTRA (Rp)</th>
                            <th>PUTRI (Rp)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {biaya.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    {item.komponen_biaya}
                                    <input type="hidden" name={`biaya[${index}][id]`} value={item.id} />
                                </td>
                                <td><input type="number" name={`biaya[${index}][putra]`} defaultValue={item.biaya_putra || 0} /></td>
                                <td><input type="number" name={`biaya[${index}][putri]`} defaultValue={item.biaya_putri || 0} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit">Simpan Perubahan Tabel Biaya</button>
            </form>

            <hr />

            {/* Form terpisah untuk catatan SPP */}
            <form action={updateCatatanSppAction}>
                <h3>Catatan Tambahan (SPP)</h3>
                <label htmlFor="catatan-spp">Teks Catatan</label>
                <input id="catatan-spp" name="catatan-spp" type="text" defaultValue={catatanSpp?.isi || ''} style={{ width: '100%' }} />
                <button type="submit">Simpan Catatan SPP</button>
            </form>
        </div>
    );
}