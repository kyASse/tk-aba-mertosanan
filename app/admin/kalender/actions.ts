// app/admin/kalender/actions.ts
'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createKegiatanAction(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const data = {
        nama_kegiatan: formData.get('nama_kegiatan') as string,
        tanggal_mulai: formData.get('tanggal_mulai') as string,
        tanggal_selesai: (formData.get('tanggal_selesai') as string) || null,
        kategori: formData.get('kategori') as string,
        keterangan: formData.get('keterangan') as string,
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