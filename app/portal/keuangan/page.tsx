import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PortalKeuanganPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: biaya } = await supabase
    .from('biaya_pendaftaran')
    .select('*')
    .order('id');

  const { data: catatan } = await supabase
    .from('konten_halaman')
    .select('isi')
    .eq('slug', 'catatan-spp')
    .single();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Informasi Keuangan</h1>
      <section>
        <h2 className="font-semibold mb-2">Rincian Biaya</h2>
        <ul className="space-y-2">
          {biaya?.map((b) => (
            <li key={b.id} className="p-3 border rounded flex justify-between">
              <span>{b.nama_biaya}</span>
              <span>Rp {Number(b.jumlah).toLocaleString('id-ID')}</span>
            </li>
          )) || <li>Tidak ada data biaya.</li>}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Catatan SPP</h2>
        <div className="p-3 border rounded bg-muted/30">
          <p className="text-sm whitespace-pre-wrap">{(catatan?.isi as any)?.catatan || 'Belum ada catatan.'}</p>
        </div>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Tagihan & Pembayaran</h2>
        <div className="p-3 border rounded text-sm text-muted-foreground">
          Fitur tagihan akan ditambahkan sesuai kebutuhan. (placeholder)
        </div>
      </section>
    </div>
  );
}
