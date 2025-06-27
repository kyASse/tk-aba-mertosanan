// app/admin/galeri/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteGaleriAction(galeriId: number, imageUrl: string) {
    const supabase = await createClient();

    // Hapus gambar dari Storage
    try {
        const path = new URL(imageUrl).pathname.split('/konten-publik/')[1];
        if (path) {
            await supabase.storage.from('konten-publik').remove([path]);
        }
    } catch (error) {
        console.error("Peringatan: Gagal menghapus gambar galeri dari storage:", (error as Error).message);
    }

    // Hapus data dari tabel database
    const { error: dbError } = await supabase
        .from('galeri')
        .delete()
        .eq('id', galeriId);
    
    if (dbError) {
        return { success: false, message: `Gagal menghapus data: ${dbError.message}` };
    }

    revalidatePath('/admin/galeri');
    return { success: true, message: "Foto berhasil dihapus." };
}