'use server'

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { sendCustomRecoveryEmail } from "@/lib/auth/recovery";

export async function createSiswaAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const nama_lengkap = (formData.get('nama_lengkap') as string)?.trim();
  const kelompok = (formData.get('kelompok') as string)?.trim() || null;

  if (!nama_lengkap) return;

  const { error } = await supabase
    .from('siswa')
    .insert({ nama_lengkap, kelompok });

  if (error) return;
  revalidatePath('/admin/siswa');
}

export async function updateSiswaKelompokAction(siswaId: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const kelompok = (formData.get('kelompok') as string)?.trim() || null;

  const { error } = await supabase
    .from('siswa')
    .update({ kelompok })
    .eq('id', siswaId);

  if (error) return;
  revalidatePath('/admin/siswa');
}

export async function linkOrCreateParentAccountAction(siswaId: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const admin = await createAdminClient();
  const email = (formData.get('email') as string)?.trim().toLowerCase();

  if (!email) return;

  try {
    // Cek apakah user sudah ada
    const { data: list, error: listErr } = await admin.auth.admin.listUsers();
    if (listErr) throw listErr;
    const existing = list.users.find(u => u.email?.toLowerCase() === email);

    let userId = existing?.id;

    // Jika belum ada, buat akun baru dan kirim email reset password
    if (!userId) {
      const { data, error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
      });
      if (createErr || !data.user) throw createErr || new Error('Gagal membuat akun orang tua.');
      userId = data.user.id;

  // Kirim email set password via provider sendiri (Resend/Mailgun/…)
  await sendCustomRecoveryEmail(email);
    }

    // Update siswa.profile_orang_tua_id
    const { error: updErr } = await supabase
      .from('siswa')
      .update({ profile_orang_tua_id: userId })
      .eq('id', siswaId);
    if (updErr) throw updErr;

    revalidatePath('/admin/siswa');
  } catch (e: any) {
    console.error('linkOrCreateParentAccountAction failed:', e?.message);
  }
}

export async function deleteSiswaAction(siswaId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('siswa').delete().eq('id', siswaId);
  if (error) return;
  revalidatePath('/admin/siswa');
}
