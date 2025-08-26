import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PortalPengumumanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: berita } = await supabase
    .from('berita')
    .select('id, judul, ringkasan, tanggal_terbit, status')
    .eq('status', 'published')
    .order('tanggal_terbit', { ascending: false })
    .limit(10);

  const { data: agenda } = await supabase
    .from('kalender_akademik')
    .select('id, judul, tanggal, tanggal_berakhir, waktu, deskripsi, kategori')
    .order('tanggal', { ascending: true })
    .limit(20);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Pengumuman & Agenda Sekolah</h1>
      <section>
        <h2 className="font-semibold mb-2">Pengumuman Terbaru</h2>
        <ul className="space-y-3">
          {berita?.map((b) => (
            <li key={b.id} className="p-3 border rounded">
              <div className="font-medium">{b.judul}</div>
              <div className="text-sm text-muted-foreground">{b.tanggal_terbit}</div>
              {b.ringkasan && <p className="text-sm mt-1">{b.ringkasan}</p>}
            </li>
          )) || <li>Tidak ada pengumuman.</li>}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Agenda</h2>
        <ul className="space-y-2">
          {agenda?.map((e) => (
            <li key={e.id} className="p-3 border rounded">
              <div className="font-medium">{e.judul}</div>
              <div className="text-sm text-muted-foreground">{e.tanggal}{e.tanggal_berakhir ? ` - ${e.tanggal_berakhir}` : ''} {e.waktu ? `• ${e.waktu}` : ''}</div>
              {e.deskripsi && <p className="text-sm mt-1">{e.deskripsi}</p>}
            </li>
          )) || <li>Tidak ada agenda.</li>}
        </ul>
      </section>
    </div>
  );
}
