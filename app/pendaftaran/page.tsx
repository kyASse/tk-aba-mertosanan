// app/pendaftaran/page.tsx
import { createClient } from "@/lib/supabase/server";
import PendaftaranForm from "@/components/Pendaftaran/PendaftaranForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    CalendarIcon,
    FileText,
    User,
    School,
    Info
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

// Tipe untuk data biaya
type BiayaItem = {
    komponen_biaya: string | null;
    biaya_putra: number | null;
    biaya_putri: number | null;
};

export default async function PendaftaranPage() {
    const supabase = await createClient();

    // Ambil semua data yang dibutuhkan secara paralel
    const persyaratanPromise = supabase.from('konten_halaman').select('judul, isi').eq('slug', 'persyaratan-pendaftaran').single();
    const biayaPromise = supabase.from('biaya_pendaftaran').select('*').order('id');
    const sppPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'catatan-spp').single();
    const jadwalPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'jadwal-pendaftaran').single();

    const [
        { data: persyaratan }, 
        { data: biaya }, 
        { data: catatanSpp },
        { data: jadwal }
    ] = await Promise.all([persyaratanPromise, biayaPromise, sppPromise, jadwalPromise]);

    // Hitung total biaya
    const totalPutra = biaya?.reduce((acc, item) => acc + (item.biaya_putra || 0), 0);
    const totalPutri = biaya?.reduce((acc, item) => acc + (item.biaya_putri || 0), 0);

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Pendaftaran Siswa Baru"
                description="Formulir pendaftaran siswa baru TK ABA Mertosanan"
                background="bg-accent/20"
            />

            <section className="py-16">
                <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <Tabs defaultValue="form" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-8">
                                    <TabsTrigger value="requirements">Persyaratan</TabsTrigger>
                                    <TabsTrigger value="form">Formulir Pendaftaran</TabsTrigger>
                                </TabsList>

                                <TabsContent value="requirements">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <FileText className="mr-2 h-5 w-5 text-primary" />
                                                Persyaratan Pendaftaran
                                            </CardTitle>
                                            <CardDescription>
                                                Informasi tentang persyaratan, jadwal, dan biaya pendaftaran siswa baru
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                                    <Info className="mr-2 h-5 w-5 text-accent" />
                                                    Persyaratan Dokumen
                                                </h3>
                                                <ul className="ml-7 space-y-2 list-disc text-muted-foreground">
                                                    <li>{persyaratan?.isi}</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                                    <CalendarIcon className="mr-2 h-5 w-5 text-highlight" />
                                                    Jadwal Pendaftaran
                                                </h3>
                                                <div className="bg-muted rounded-lg p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-medium">Gelombang I</h4>
                                                            <p className="text-muted-foreground">{jadwal?.isi}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">Gelombang II</h4>
                                                            <p className="text-muted-foreground">{jadwal?.isi}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Jadwal pendaftaran dapat berubah sewaktu-waktu. Jika sudah melewati jadwal pendaftaran, silakan hubungi pihak sekolah.
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                                    <School className="mr-2 h-5 w-5 text-primary" />
                                                    Biaya Pendaftaran
                                                </h3>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-muted">
                                                                <th className="border px-4 py-2 text-left">Komponen Biaya</th>
                                                                <th className="border px-4 py-2 text-left">PUTRA (Rp)</th>
                                                                <th className="border px-4 py-2 text-left">PUTRI (Rp)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {biaya?.map((item: BiayaItem, index) => (
                                                                <tr key={index}>
                                                                    <td className="border px-4 py-2 font-medium">{item.komponen_biaya}</td>
                                                                    <td className="border px-4 py-2">{item.biaya_putra?.toLocaleString('id-ID')}</td>
                                                                    <td className="border px-4 py-2">{item.biaya_putri?.toLocaleString('id-ID')}</td>
                                                                </tr>
                                                            ))}
                                                            <tr>
                                                                <td className="border px-4 py-2 font-bold">Total Biaya</td>
                                                                <td className="border px-4 py-2 font-semibold">{totalPutra?.toLocaleString('id-ID')}</td>
                                                                <td className="border px-4 py-2 font-semibold">{totalPutri?.toLocaleString('id-ID')}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                                    <Info className="mr-2 h-5 w-5 text-primary" />
                                                    Catatan SPP
                                                </h3>
                                                <div className="bg-muted rounded-lg p-4">
                                                    <p className="text-muted-foreground">{catatanSpp?.isi}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="form">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <User className="mr-2 h-5 w-5 text-primary" />
                                                Formulir Pendaftaran
                                            </CardTitle>
                                            <CardDescription>
                                                Mohon isi formulir dengan data yang benar dan lengkap
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <PendaftaranForm />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                </div>
            </section>
        </div>
    )
}
