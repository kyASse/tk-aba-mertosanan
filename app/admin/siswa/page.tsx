// app/admin/siswa/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSiswaAction, updateSiswaKelompokAction, linkOrCreateParentAccountAction, deleteSiswaAction } from "./actions";

export default async function KelolaSiswaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');

  const { data: siswa, error } = await supabase
    .from('siswa')
    .select('id, nama_lengkap, kelompok, profile_orang_tua_id');
  if (error) {
    return <div className="p-6">Gagal memuat data siswa: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelola Siswa</h1>
          <p className="text-muted-foreground">Tambah, ubah, hubungkan akun orang tua</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Kembali</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createSiswaAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
              <Input name="nama_lengkap" id="nama_lengkap" required />
            </div>
            <div>
              <Label htmlFor="kelompok">Kelompok</Label>
              <Input name="kelompok" id="kelompok" placeholder="TK A / TK B / dst" />
            </div>
            <div className="flex items-end">
              <Button type="submit">Tambah</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {siswa && siswa.length > 0 ? (
            siswa.map((s: any) => (
              <div key={s.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border-b pb-4">
                <div>
                  <Label>Nama</Label>
                  <div className="font-medium">{s.nama_lengkap}</div>
                </div>
                <form action={updateSiswaKelompokAction.bind(null, s.id)} className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`kelompok-${s.id}`}>Kelompok</Label>
                    <Input id={`kelompok-${s.id}`} name="kelompok" defaultValue={s.kelompok ?? ''} />
                  </div>
                  <div className="self-end">
                    <Button type="submit" variant="secondary">Simpan</Button>
                  </div>
                </form>
                <form action={linkOrCreateParentAccountAction.bind(null, s.id)} className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`email-${s.id}`}>Email Orang Tua</Label>
                    <Input id={`email-${s.id}`} name="email" type="email" placeholder="parent@mail.com" />
                  </div>
                  <div className="self-end">
                    <Button type="submit">Hubungkan/Buat Akun</Button>
                  </div>
                </form>
                <form action={deleteSiswaAction.bind(null, s.id)} className="justify-self-end">
                  <Button type="submit" variant="destructive">Hapus</Button>
                </form>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">Belum ada data siswa.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
