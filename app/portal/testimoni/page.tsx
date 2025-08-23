import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PortalTestimoniPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: testimoni } = await supabase
    .from('testimoni')
    .select('id, nama_orang_tua, status_orang_tua, isi_testimoni, is_featured, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Testimoni</h1>
      <ul className="space-y-4">
        {testimoni?.map((t) => (
          <li key={t.id} className="p-4 border rounded">
            <div className="font-medium">{t.nama_orang_tua} {t.status_orang_tua ? `• ${t.status_orang_tua}` : ''}</div>
            <p className="mt-1 text-sm">{t.isi_testimoni}</p>
          </li>
        )) || <li>Tidak ada testimoni.</li>}
      </ul>
    </div>
  );
}
