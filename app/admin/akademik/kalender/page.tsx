import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteEventButton from "./DeleteEventButton";

type KalenderEvent = {
  id: number;
  judul: string;
  tanggal: string;
  waktu?: string;
  deskripsi?: string;
  kategori: string;
  warna: string;
  created_at: string;
};

export default async function AdminKalenderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return redirect('/auth/login');

  const { data: events, error } = await supabase
    .from('kalender_akademik')
    .select('*')
    .order('tanggal', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return <p>Gagal memuat data kalender.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Kelola Kalender Akademik</h1>
        <div className="flex gap-2">
          <Link href="/admin/kalender/tambah" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">
            Tambah Event
          </Link>
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">Tanggal</th>
              <th className="text-left px-4 py-2">Judul</th>
              <th className="text-left px-4 py-2">Waktu</th>
              <th className="text-left px-4 py-2">Kategori</th>
              <th className="text-left px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {events && events.length > 0 ? (
              events.map((event: KalenderEvent) => (
                <tr key={event.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{new Date(event.tanggal).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-2 font-medium">{event.judul}</td>
                  <td className="px-4 py-2">{event.waktu || '-'}</td>
                  <td className="px-4 py-2">
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ backgroundColor: event.warna + '20', color: event.warna }}
                    >
                      {event.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2 items-center justify-center">
                    <Link
                      href={`/admin/kalender/edit/${event.id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition font-semibold"
                    >
                      Edit
                    </Link>
                    <DeleteEventButton eventId={event.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Belum ada event kalender.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
