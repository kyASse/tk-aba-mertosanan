// lib/email/notify.ts
'use server';

import { sendEmail } from '@/lib/email/sender';

type NotifyArgs = {
  parentEmail: string;
  siswaNama?: string | null;
  siswaId?: string;
  source: 'pendaftar' | 'siswa';
};

export async function notifyAdminParentAccountCreated({ parentEmail, siswaNama, siswaId, source }: NotifyArgs) {
  const toEnv = process.env.ADMIN_NOTIFICATION_EMAILS || process.env.ADMIN_EMAIL;
  if (!toEnv) {
    // No admin email configured; silently skip
    return;
  }
  const toList = toEnv.split(',').map(s => s.trim()).filter(Boolean);
  if (toList.length === 0) return;

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siswaLink = siswaId ? `${site}/admin/siswa` : `${site}/admin`; // generic link if no ID

  const subject = 'Notifikasi: Akun Orang Tua Berhasil Dibuat';
  const html = `
    <p>Halo Admin,</p>
    <p>Sebuah akun portal orang tua baru telah berhasil dibuat.</p>
    <ul>
      <li>Email Orang Tua: <strong>${parentEmail}</strong></li>
      ${siswaNama ? `<li>Nama Siswa: <strong>${siswaNama}</strong></li>` : ''}
      <li>Sumber Proses: ${source === 'pendaftar' ? 'Dari halaman Pendaftar' : 'Dari halaman Siswa'}</li>
    </ul>
    <p>Anda dapat meninjau atau memperbarui keterkaitan siswa di halaman admin: <a href="${siswaLink}">${siswaLink}</a></p>
    <p>Terima kasih.</p>
  `;

  await sendEmail({ to: toList.join(','), subject, html });
}
