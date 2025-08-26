'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// Helper to ensure only pdf and limited size
function validatePdf(file: File | null, maxMB = 10) {
  if (!file) return { ok: false, message: 'File rapor (PDF) wajib diunggah.' };
  if (file.type !== 'application/pdf') return { ok: false, message: 'File harus berformat PDF.' };
  if (file.size > maxMB * 1024 * 1024) return { ok: false, message: `Ukuran file maksimal ${maxMB}MB.` };
  return { ok: true };
}

export async function createLaporanAction(prevState: any, formData: FormData): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Unauthorized' };
  // Pastikan hanya admin yang boleh membuat laporan
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return { success: false, message: 'Forbidden' };

  // Gunakan klien admin untuk melewati RLS pada operasi tulis
  const admin = await createAdminClient();
  const siswaIdRaw = (formData.get('siswa_id') as string) || '';
  const semester = (formData.get('semester') as string) || '';
  const tahun_ajaran = (formData.get('tahun_ajaran') as string) || '';
  const catatan_guru = (formData.get('catatan_guru') as string) || null;
  const rapor = formData.get('rapor') as File | null;

  if (!siswaIdRaw || !semester || !tahun_ajaran) {
    return { success: false, message: 'Form tidak lengkap' };
  }
  const siswa_id = siswaIdRaw;

  const v = validatePdf(rapor);
  if (!v.ok) {
    return { success: false, message: v.message };
  }

  try {
    const safeSemester = semester.replace(/\s+/g, '-').toLowerCase();
    const safeTA = tahun_ajaran.replace(/\s+/g, '-');
    const filePath = `${siswa_id}/${safeSemester}-${safeTA}-${Date.now()}.pdf`;
  const { error: uploadError, data: uploaded } = await admin.storage
      .from('dokumen-rapor')
      .upload(filePath, rapor as File);
    if (uploadError || !uploaded?.path) {
      return { success: false, message: uploadError?.message || 'Gagal mengunggah rapor' };
    }

  const { data: pub } = admin.storage
      .from('dokumen-rapor')
      .getPublicUrl(uploaded.path);
    const dokumen_rapor_url = pub.publicUrl;

  const { error } = await admin
      .from('laporan_perkembangan')
      .insert({ siswa_id, semester, tahun_ajaran, catatan_guru, dokumen_rapor_url });
    if (error) {
      // cleanup upload
      try {
  await admin.storage.from('dokumen-rapor').remove([uploaded.path]);
      } catch {}
      return { success: false, message: error.message };
    }
    revalidatePath('/admin/akademik/laporan');
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Terjadi kesalahan tak terduga' };
  }
}

export async function deleteLaporanAction(id: number, _formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return;

  const admin = await createAdminClient();

  // Ambil dulu URL untuk hapus dari storage
  const { data: row } = await admin
    .from('laporan_perkembangan')
    .select('dokumen_rapor_url')
    .eq('id', id)
    .single();

  // Hapus data dari DB
  const { error } = await admin
    .from('laporan_perkembangan')
    .delete()
    .eq('id', id);
  if (error) return;

  // Coba hapus file dari storage (best-effort)
  try {
    const url = row?.dokumen_rapor_url as string | undefined;
    if (url && url.includes('/dokumen-rapor/')) {
      const path = new URL(url).pathname.split('/dokumen-rapor/')[1];
  if (path) await admin.storage.from('dokumen-rapor').remove([path]);
    }
  } catch {}

  revalidatePath('/admin/akademik/laporan');
}
