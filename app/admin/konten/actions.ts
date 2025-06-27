// app/admin/konten/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

// UPDATE Action
export async function updateKontenAction(slug: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/auth/login');
    }

    const dataToUpdate = {
        judul: formData.get('judul') as string,
        isi: formData.get('isi') as string,
        last_updated_by: user.id, // Catat siapa yang terakhir mengedit
        updated_at: new Date().toISOString(), // Perbarui timestamp
    };

    const { error } = await supabase
        .from('konten_halaman')
        .update(dataToUpdate)
        .eq('slug', slug);
    
    if (error) {
        console.error("Gagal update konten:", error);
        // Mungkin redirect dengan pesan error
        redirect(`/admin/konten/edit/${slug}?error=true`);
    }

    // Revalidasi path agar halaman publik yang menggunakan konten ini juga ikut ter-refresh
    revalidatePath('/', 'layout'); 
    revalidatePath('/admin/konten');
    revalidatePath(`/admin/konten/edit/${slug}`);
    
    // Redirect kembali ke daftar konten setelah sukses
    redirect('/admin/konten');
}