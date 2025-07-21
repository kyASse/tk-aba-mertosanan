// app/admin/kalender/actions.ts
'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createKegiatanAction(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const data = {
        judul: formData.get('judul') as string,
        tanggal: formData.get('tanggal') as string,
        waktu: (formData.get('waktu') as string) || null,
        kategori: formData.get('kategori') as string,
        deskripsi: formData.get('deskripsi') as string,
        warna: formData.get('warna') as string || '#3b82f6',
    };
    const { error } = await supabase.from('kalender_akademik').insert(data);
    if (error) { return { success: false, message: error.message }; }
    revalidatePath('/admin/kalender');
    redirect('/admin/kalender');
}

export async function deleteKegiatanAction(kegiatanId: number) {
    const supabase = await createClient();
    const { error } = await supabase.from('kalender_akademik').delete().eq('id', kegiatanId);
    if (error) { return { success: false, message: error.message }; }
    revalidatePath('/admin/kalender');
    return { success: true };
}