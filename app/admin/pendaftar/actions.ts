// app/admin/pendaftar/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =================================================================
// ACTION UNTUK MEMPERBARUI STATUS PENDAFTARAN
// =================================================================

export async function updateStatusPendaftaranAction(pendaftarId: string, formData: FormData) {
    const supabase = await createClient(); // Menggunakan klien standar
    
    const newStatus = formData.get('newStatus') as string;

    if (!newStatus) {
        return { success: false, message: 'Status tidak boleh kosong.' };
    }

    const { error } = await supabase
        .from('pendaftar')
        .update({ status_pendaftaran: newStatus })
        .eq('id', pendaftarId);

    if (error) {
        console.error("Gagal update status:", error);
        return { success: false, message: error.message };
    }
    
    revalidatePath('/admin/pendaftar');
    revalidatePath(`/admin/pendaftar/detail/${pendaftarId}`);
    
    return { success: true, message: 'Status berhasil diperbarui!' };
}

// =================================================================
// ACTION UNTUK MEMBUAT AKUN PORTAL ORANG TUA
// =================================================================

// Tipe data untuk memastikan kita menerima data pendaftar yang benar
type PendaftarLengkap = {
    id: string;
    nama_lengkap: string | null;
    email: string | null;
};

export async function createPortalAccountAction(pendaftar: PendaftarLengkap) {
    // PENTING: Kita tetap menggunakan createClient(), tapi kita akan memanggil .auth.admin
    // Ini hanya akan berhasil jika createClient() di server menggunakan service_role_key.
    // Berdasarkan setup kita sebelumnya di lib/supabase/admin.ts, kita seharusnya
    // menggunakan createAdminClient(). Namun, jika Anda ingin tetap seperti ini,
    // pastikan createClient() Anda di server memiliki hak akses yang cukup.
    // Untuk tujuan ini, saya akan asumsikan createClient() bisa mengakses Admin API.
    const supabase = await createClient();

    if (!pendaftar.email) {
        return { success: false, message: "Gagal: Pendaftar tidak memiliki alamat email." };
    }

    try {
        // 1. Cek apakah user dengan email ini sudah ada
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        const existingUser = users.find((user: any) => user.email === pendaftar.email);
        if (existingUser) {
            return { success: false, message: `Gagal: Akun dengan email ${pendaftar.email} sudah terdaftar.` };
        }

        // 2. Buat user baru di Supabase Auth
        const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
            email: pendaftar.email,
            email_confirm: true,
        });

        if (createError || !newUser) {
            throw createError || new Error("Gagal membuat user baru.");
        }

        // 3. Buat entri siswa baru
        const { error: siswaError } = await supabase
            .from('siswa')
            .insert({
                profile_orang_tua_id: newUser.id,
                nama_lengkap: pendaftar.nama_lengkap,
                pendaftar_asli_id: pendaftar.id,
            });
        
        if (siswaError) throw siswaError;

        // 4. Kirim email reset password
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(pendaftar.email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
        });

        if (resetError) throw resetError;
        
        // 5. Update status pendaftar
        const { error: updateStatusError } = await supabase.from('pendaftar').update({ status_pendaftaran: 'Akun Dibuat' }).eq('id', pendaftar.id);
        if (updateStatusError) throw updateStatusError;

        revalidatePath('/admin/pendaftar');
        revalidatePath(`/admin/pendaftar/detail/${pendaftar.id}`);

        return { success: true, message: `Akun portal untuk ${pendaftar.email} berhasil dibuat. Email instruksi telah dikirim.` };

    } catch (error: any) {
        console.error("Terjadi error di createPortalAccountAction:", error);
        return { success: false, message: error.message || "Terjadi kesalahan yang tidak diketahui." };
    }
}