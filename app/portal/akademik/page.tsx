import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PortalAkademikPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: siswa } = await supabase
    .from('siswa')
    .select('id, nama_lengkap, kelompok')
    .eq('profile_orang_tua_id', user.id);

  // Jadwal kegiatan memakai kalender_akademik umum (bisa dikembangkan per siswa/ekstra di masa depan)
  const { data: events } = await supabase
    .from('kalender_akademik')
    .select('*')
    .order('tanggal', { ascending: true });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Informasi Akademik Anak</h1>
      <div>
        <h2 className="font-semibold mb-2">Data Anak</h2>
        <ul className="list-disc ml-5">
          {siswa?.map((s) => (
            <li key={s.id}>{s.nama_lengkap} {s.kelompok ? `- ${s.kelompok}` : ''}</li>
          )) || <li>Tidak ada data</li>}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Jadwal Kegiatan</h2>
        <ul className="space-y-2">
          {events?.map((e) => (
            <li key={e.id} className="border rounded p-3">
              <div className="font-medium">{e.judul}</div>
              <div className="text-sm text-muted-foreground">{e.tanggal}{e.tanggal_berakhir ? ` - ${e.tanggal_berakhir}` : ''} {e.waktu ? `• ${e.waktu}` : ''}</div>
              {e.deskripsi && <p className="text-sm mt-1">{e.deskripsi}</p>}
            </li>
          )) || <li>Tidak ada kegiatan</li>}
        </ul>
      </div>
    </div>
  );
}
