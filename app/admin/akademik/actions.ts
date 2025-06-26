// app/admin/akademik/actions.ts
'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- ACTIONS UNTUK BIAYA ---
export async function updateBiayaAction(formData: FormData) {
    const supabase = await createClient();
    const entries = Array.from(formData.entries());
    const biayaData: any[] = [];
    
    entries.forEach(([key, value]) => {
        const match = key.match(/biaya\[(\d+)\]\[(\w+)\]/);
        if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!biayaData[index]) biayaData[index] = {};
            biayaData[index][field] = value;
        }
    });

    // Sesuaikan dengan nama kolom baru: biaya_putra dan biaya_putri
    const updates = biayaData.map(item => ({
        id: parseInt(item.id),
        biaya_putra: parseInt(item.putra) || 0,
        biaya_putri: parseInt(item.putri) || 0,
    }));

    const { error } = await supabase.from('biaya_pendaftaran').upsert(updates);
    if (error) { redirect(`/admin/akademik/edit-biaya?error=${error.message}`); }

    revalidatePath('/admin/akademik');
    redirect('/admin/akademik');
}

// Action baru untuk mengupdate catatan SPP
export async function updateCatatanSppAction(formData: FormData) {
    const supabase = await createClient();
    const newCatatan = formData.get('catatan-spp') as string;

    const { error } = await supabase
        .from('konten_halaman')
        .update({ isi: newCatatan })
        .eq('slug', 'catatan-spp');

    if (error) { redirect(`/admin/akademik/edit-biaya?error=${error.message}`); }
    
    revalidatePath('/admin/akademik');
    redirect('/admin/akademik');
}

// --- ACTIONS UNTUK PRESTASI ---

// CREATE
export async function createPrestasiAction(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const data = {
        tahun: parseInt(formData.get('tahun') as string),
        nama_prestasi: formData.get('nama_prestasi') as string,
        tingkat: formData.get('tingkat') as string,
        deskripsi: formData.get('deskripsi') as string,
    };
    const { error } = await supabase.from('prestasi').insert(data);
    if (error) { return { success: false, message: error.message }; }

    revalidatePath('/admin/akademik');
    redirect('/admin/akademik');
}

// UPDATE
export async function updatePrestasiAction(prestasiId: number, formData: FormData) {
    const supabase = await createClient();
    const data = {
        tahun: parseInt(formData.get('tahun') as string),
        nama_prestasi: formData.get('nama_prestasi') as string,
        tingkat: formData.get('tingkat') as string,
        deskripsi: formData.get('deskripsi') as string,
    };
    const { error } = await supabase.from('prestasi').update(data).eq('id', prestasiId);
    if (error) { redirect(`/admin/akademik/prestasi/edit/${prestasiId}?error=true`); }

    revalidatePath('/admin/akademik');
    redirect('/admin/akademik');
}

// DELETE
export async function deletePrestasiAction(prestasiId: number) {
    const supabase = await createClient();
    const { error } = await supabase.from('prestasi').delete().eq('id', prestasiId);
    if (error) { return { success: false, message: error.message }; }

    revalidatePath('/admin/akademik');
    return { success: true, message: "Prestasi berhasil dihapus." };
}