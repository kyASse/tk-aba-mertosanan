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
    <div>
      <h1>Edit Berita: {berita.judul}</h1>
      <Link href="/admin/berita">Kembali ke Daftar Berita</Link>
      <hr style={{ margin: "1rem 0" }} />
      <EditForm berita={berita} />
    </div>
  );
}
