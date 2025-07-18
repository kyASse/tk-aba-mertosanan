// app/admin/pendaftar/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PendaftarTable from "@/components/admin/PendaftarTable";

export default async function KelolaPendaftarPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/auth/login');

    const { data: pendaftar, error } = await supabase
        .from('pendaftar')
        .select('id, nama_lengkap, nama_ayah_kandung, nama_ibu_kandung, jenis_kelamin, tanggal_lahir, status_pendaftaran, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pendaftar:', error);
        return <p>Gagal memuat data pendaftar.</p>;
    }

    // Hitung statistik
    const totalPendaftar = pendaftar?.length || 0;
    const menungguPersetujuan = pendaftar?.filter(p => p.status_pendaftaran === 'menunggu_persetujuan').length || 0;
    const diterima = pendaftar?.filter(p => p.status_pendaftaran === 'diterima').length || 0;
    const validasiUlang = pendaftar?.filter(p => p.status_pendaftaran === 'validasi_ulang').length || 0;
    const pendaftarDitolak = pendaftar?.filter(p => p.status_pendaftaran === 'ditolak').length || 0;

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Kelola Pendaftaran</h1>
                    <p className="text-gray-600 mt-1">mengelola pendaftaran siswa untuk tahun ajaran mendatang</p>
                </div>
                <Link href="/admin">
                    <Button variant="outline">
                        &larr; Kembali ke Dashboard
                    </Button>
                </Link>
            </div>

            {/* Status Pendaftaran Cards */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Status Pendaftaran</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Total Pendaftar</p>
                            <p className="text-2xl font-bold text-orange-600">{totalPendaftar}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Menunggu Persetujuan</p>
                            <p className="text-2xl font-bold text-blue-600">{menungguPersetujuan}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Pendaftaran Yang Disetujui</p>
                            <p className="text-2xl font-bold text-green-600">{diterima}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Validasi Ulang</p>
                            <p className="text-2xl font-bold text-yellow-600">{validasiUlang}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Pendaftar Yang Ditolak</p>
                            <p className="text-2xl font-bold text-red-600">{pendaftarDitolak}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Tabel Pendaftar dengan Search */}
            <PendaftarTable pendaftar={pendaftar || []} />
        </div>
    );
}