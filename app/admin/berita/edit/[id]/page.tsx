import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditForm from "../EditForm";

export default async function EditBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  const beritaId = parseInt(id, 10);

  if (isNaN(beritaId)) {
    console.error("ID Berita tidak valid:", id);
    return redirect("/admin/berita");
  }

  const { data: berita, error } = await supabase
    .from("berita")
    .select("*")
    .eq("id", beritaId)
    .single();

  if (error || !berita) {
    console.error("Gagal menemukan berita dengan ID:", beritaId, error);
    return redirect("/admin/berita");
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2 text-center">Edit Berita: {berita.judul}</h1>
      <Link
        href="/admin/berita"
        className="text-blue-600 hover:underline inline-block mb-4 text-center w-full"
      >
        &larr; Kembali ke Daftar Berita
      </Link>
      <hr className="my-4" />

      {berita.image_url && (
        <div className="flex justify-center mb-6">
          <img
            src={berita.image_url}
            alt={berita.judul}
            className="rounded-lg shadow-md max-h-64 object-contain"
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center">
        <div className="w-full max-w-lg">
          <EditForm berita={berita} />
        </div>
      </div>
    </div>
  );
}