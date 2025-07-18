import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProcessRegistrationButton from "./ProcessRegistrationButton";
import StatusSelect from "./StatusSelect";
import EditPendaftarButton from "./EditPendaftarButton";


// ...existing imports...

type Pendaftar = {
    id: string;
    nama_lengkap: string | null;
    nama_ayah_kandung?: string | null;
    nama_ibu_kandung?: string | null;
    nama_orang_tua?: string | null;
    status_pendaftaran: string | null;
    created_at: string;
};

// export default async function KelolaPendaftarPage() {
//     const supabase = await createClient();

//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return redirect('/auth/login');

//     // Ambil semua field yang dibutuhkan
//     const { data: pendaftar, error } = await supabase
//         .from('pendaftar')
//         .select('id, nama_lengkap, nama_ayah_kandung, nama_ibu_kandung, status_pendaftaran, created_at')
//         .order('created_at', { ascending: false });

//     if (error) {
//         console.error('Error fetching pendaftar:', error);
//         return <p>Gagal memuat data pendaftar.</p>;
//     }

//     return (
//         <div className="max-w-5xl mx-auto py-8 px-4">
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//                 <h1 className="text-2xl font-bold">Manajemen Pendaftar Siswa Baru</h1>
//                 <Link href="/admin" className="text-blue-600 hover:underline">
//                     &larr; Kembali ke Dasbor
//                 </Link>
//             </div>
//             <hr className="my-4" />

//             <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white rounded shadow">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="text-left px-4 py-2">Nama Calon Siswa</th>
//                             <th className="text-left px-4 py-2">Nama Orang Tua</th>
//                             <th className="text-left px-4 py-2">Tanggal Daftar</th>
//                             <th className="text-left px-4 py-2">Status</th>
//                             <th className="text-left px-4 py-2">Aksi</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pendaftar && pendaftar.length > 0 ? (
//                             pendaftar.map((item: Pendaftar) => (
//                                 <tr key={item.id} className="border-b hover:bg-gray-50 transition">
//                                     <td className="px-4 py-2 font-medium">{item.nama_lengkap}</td>
//                                     <td className="px-4 py-2">
//                                         {(item.nama_ayah_kandung || item.nama_ibu_kandung)
//                                             ? [item.nama_ayah_kandung, item.nama_ibu_kandung].filter(Boolean).join(" & ")
//                                             : "-"}
//                                     </td>
//                                     <td className="px-4 py-2">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
//                                     <td className="px-4 py-2">
//                                         <span className={`px-2 py-1 rounded text-xs font-semibold
//                                             ${item.status_pendaftaran === "Akun Dibuat"
//                                                 ? "bg-green-100 text-green-700"
//                                                 : item.status_pendaftaran === "Diterima"
//                                                 ? "bg-blue-100 text-blue-700"
//                                                 : "bg-yellow-100 text-yellow-700"
//                                             }`
//                                         }>
//                                             {item.status_pendaftaran}
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-2">
//                                         <Link
//                                             href={`/admin/pendaftar/detail/${item.id}`}
//                                             className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition font-semibold"
//                                         >
//                                             Detail
//                                         </Link>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={5} className="text-center py-8 text-gray-500">
//                                     Belum ada pendaftar baru.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// ...existing imports...

function DataField({ label, value }: { label: string, value: string | number | null | undefined }) {
    if (!value && value !== 0) {
        return null;
    }
    return (
        <div className="mb-3 border-b border-gray-100 pb-2">
            <span className="block text-xs text-gray-500 mb-1 font-semibold">{label}</span>
            <span className="text-base">{value}</span>
        </div>
    );
}

export default async function DetailPendaftarPage({ params }: DetailPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: pendaftar, error } = await supabase
        .from('pendaftar')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !pendaftar) {
        console.error("Gagal menemukan pendaftar:", error);
        return redirect('/admin/pendaftar');
    }

    const canBeProcessed = pendaftar.status_pendaftaran === 'Menunggu Konfirmasi';
    const isProcessed = ['Diterima', 'Akun Dibuat'].includes(pendaftar.status_pendaftaran || '');
    const isRejected = pendaftar.status_pendaftaran === 'Ditolak';
    const isRevisi = pendaftar.status_pendaftaran === "Revisi";


    // Helper kebutuhan khusus
    const kebutuhanKhusus = Array.isArray(pendaftar.jenis_kebutuhan_khusus)
        ? pendaftar.jenis_kebutuhan_khusus
        : (pendaftar.jenis_kebutuhan_khusus ? JSON.parse(pendaftar.jenis_kebutuhan_khusus) : []);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 font-sans">
            <Link href="/admin/pendaftar" className="text-blue-600 hover:underline mb-4 inline-block">
                &larr; Kembali ke Daftar Pendaftar
            </Link>
            <h1 className="text-2xl font-bold border-b-2 border-gray-200 pb-3 mb-8">
                Detail Pendaftar: {pendaftar.nama_lengkap}
            </h1>

            <div className="grid grid-cols-1 gap-8">
                <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <legend className="font-semibold text-lg text-gray-700 px-2">A. Keterangan Anak</legend>
                    <DataField label="Nama Lengkap" value={pendaftar.nama_lengkap} />
                    <DataField label="Nama Panggilan" value={pendaftar.nama_panggilan} />
                    <DataField label="Jenis Kelamin" value={pendaftar.jenis_kelamin} />
                    <DataField label="Tempat, Tanggal Lahir" value={`${pendaftar.tempat_lahir}, ${new Date(pendaftar.tanggal_lahir).toLocaleDateString('id-ID')}`} />
                    <DataField label="Agama" value={pendaftar.agama} />
                    <DataField label="Kewarganegaraan" value={pendaftar.kewarganegaraan} />
                    <DataField label="Anak ke" value={pendaftar.anak_ke} />
                    <DataField label="Jumlah Saudara Kandung" value={pendaftar.jumlah_saudara_kandung} />
                    <DataField label="Status Anak" value={pendaftar.status_anak} />
                    <DataField label="Bahasa Sehari-hari" value={pendaftar.bahasa_sehari_hari} />
                    <DataField label="Berat / Tinggi Badan" value={`${pendaftar.berat_badan || '-'} Kg / ${pendaftar.tinggi_badan || '-'} Cm`} />
                    <DataField label="Golongan Darah" value={pendaftar.golongan_darah} />
                    <DataField label="Cita-cita" value={pendaftar.cita_cita} />
                    <DataField label="Alamat Tempat Tinggal" value={pendaftar.alamat_lengkap} />
                    <DataField label="Nomor Telepon/HP" value={pendaftar.nomor_telepon} />
                    <DataField label="Jarak Tempat Tinggal" value={pendaftar.jarak_tempat_tinggal} />
                </fieldset>

                <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <legend className="font-semibold text-lg text-gray-700 px-2">B. Orang Tua</legend>
                    <DataField label="Nama Ayah Kandung" value={pendaftar.nama_ayah_kandung} />
                    <DataField label="Pendidikan Ayah" value={pendaftar.pendidikan_ayah} />
                    <DataField label="Pekerjaan Ayah" value={pendaftar.pekerjaan_ayah} />
                    <hr className="my-4"/>
                    <DataField label="Nama Ibu Kandung" value={pendaftar.nama_ibu_kandung} />
                    <DataField label="Pendidikan Ibu" value={pendaftar.pendidikan_ibu} />
                    <DataField label="Pekerjaan Ibu" value={pendaftar.pekerjaan_ibu} />
                    <hr className="my-4"/>
                    <DataField label="Email Kontak Utama" value={pendaftar.email} />
                </fieldset>

                {pendaftar.wali_nama && (
                    <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
                        <legend className="font-semibold text-lg text-gray-700 px-2">C. Wali Anak</legend>
                        <DataField label="Nama Wali" value={pendaftar.wali_nama} />
                        <DataField label="Pendidikan Wali" value={pendaftar.wali_pendidikan} />
                        <DataField label="Hubungan dengan Keluarga" value={pendaftar.wali_hubungan} />
                        <DataField label="Pekerjaan Wali" value={pendaftar.wali_pekerjaan} />
                    </fieldset>
                )}

                {/* Bagian kebutuhan khusus */}
                {pendaftar.memiliki_kebutuhan_khusus && (
                    <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
                        <legend className="font-semibold text-lg text-gray-700 px-2">D. Kebutuhan Khusus</legend>
                        <DataField label="Memiliki Kebutuhan Khusus" value={pendaftar.memiliki_kebutuhan_khusus ? "Ya" : "Tidak"} />
                        {kebutuhanKhusus && kebutuhanKhusus.length > 0 && (
                            <DataField
                                label="Jenis Kebutuhan Khusus"
                                value={kebutuhanKhusus.map((id: string) => {
                                    const item = jenisKebutuhanKhususItems.find(i => i.id === id);
                                    return item ? item.label : id;
                                }).join(", ")}
                            />
                        )}
                        <DataField label="Deskripsi Kebutuhan Khusus" value={pendaftar.deskripsi_kebutuhan_khusus} />
                        {pendaftar.dokumen_pendukung_url && (
                            <div className="mb-3">
                                <span className="block text-xs text-gray-500 mb-1 font-semibold">Dokumen Pendukung</span>
                                <a
                                    href={pendaftar.dokumen_pendukung_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Download Dokumen
                                </a>
                            </div>
                        )}
                    </fieldset>
                )}
            </div>

            <hr className="my-8" />

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Status & Aksi Pendaftaran</h3>
                <div className="flex items-center gap-3 mb-4">
                    <span>Status Saat Ini:</span>
                    {/* Dropdown status, client component */}
                    <StatusSelect id={pendaftar.id} value={pendaftar.status_pendaftaran} />
                </div>
                {canBeProcessed && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                        <p className="mb-3">Pendaftar ini sedang menunggu konfirmasi. Klik tombol di bawah untuk menerima siswa dan secara otomatis membuatkan akun portal untuk orang tua.</p>
                        <ProcessRegistrationButton pendaftar={pendaftar} />
                    </div>
                )}
                {isProcessed && (
                    <p className="text-green-700 font-bold mt-6">
                        ✓ Proses penerimaan untuk siswa ini sudah selesai.
                    </p>
                )}
                {isRejected && (
                    <p className="text-red-700 font-bold mt-6">
                        Pendaftaran untuk siswa ini telah ditolak.
                    </p>
                )}
                {isRevisi && (
                        <EditPendaftarButton pendaftar={pendaftar} />
                )}
                    
            </div>
        </div>
        
    );
}

// Tambahkan ini di atas export default agar kebutuhan khusus bisa di-mapping labelnya
const jenisKebutuhanKhususItems = [
    { id: "gangguan_penglihatan", label: "Gangguan Penglihatan" },
    { id: "gangguan_pendengaran", label: "Gangguan Pendengaran" },
    { id: "gangguan_komunikasi", label: "Gangguan Komunikasi / Wicara" },
    { id: "autisme", label: "Spektrum Autisme (ASD)" },
    { id: "adhd", label: "ADHD (Attention Deficit Hyperactivity Disorder)" },
    { id: "kesulitan_belajar", label: "Kesulitan Belajar Spesifik" },
    { id: "hambatan_fisik", label: "Hambatan Fisik / Motorik" },
    { id: "lainnya", label: "Lainnya" },
];

// type DetailPageProps = { params: Promise<{ id: string }> };

// function DataField({ label, value }: { label: string, value: string | number | null | undefined }) {
//     if (!value && value !== 0) {
//         return null;
//     }
//     return (
//         <div className="mb-3 border-b border-gray-100 pb-2">
//             <span className="block text-xs text-gray-500 mb-1 font-semibold">{label}</span>
//             <span className="text-base">{value}</span>
//         </div>
//     );
// }

// export default async function DetailPendaftarPage({ params }: DetailPageProps) {
//     const { id } = await params;
//     const supabase = await createClient();

//     const { data: pendaftar, error } = await supabase
//         .from('pendaftar')
//         .select('*')
//         .eq('id', id)
//         .single();

//     if (error || !pendaftar) {
//         console.error("Gagal menemukan pendaftar:", error);
//         return redirect('/admin/pendaftar');
//     }

//     const canBeProcessed = pendaftar.status_pendaftaran === 'Menunggu Konfirmasi';
//     const isProcessed = ['Diterima', 'Akun Dibuat'].includes(pendaftar.status_pendaftaran || '');
//     const isRejected = pendaftar.status_pendaftaran === 'Ditolak';

//     return (
//         <div className="max-w-3xl mx-auto py-8 px-4 font-sans">
//             <Link href="/admin/pendaftar" className="text-blue-600 hover:underline mb-4 inline-block">
//                 &larr; Kembali ke Daftar Pendaftar
//             </Link>
//             <h1 className="text-2xl font-bold border-b-2 border-gray-200 pb-3 mb-8">
//                 Detail Pendaftar: {pendaftar.nama_lengkap}
//             </h1>

//             <div className="grid grid-cols-1 gap-8">
//                 <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
//                     <legend className="font-semibold text-lg text-gray-700 px-2">A. Keterangan Anak</legend>
//                     <DataField label="Nama Lengkap" value={pendaftar.nama_lengkap} />
//                     <DataField label="Nama Panggilan" value={pendaftar.nama_panggilan} />
//                     <DataField label="Jenis Kelamin" value={pendaftar.jenis_kelamin} />
//                     <DataField label="Tempat, Tanggal Lahir" value={`${pendaftar.tempat_lahir}, ${new Date(pendaftar.tanggal_lahir).toLocaleDateString('id-ID')}`} />
//                     <DataField label="Agama" value={pendaftar.agama} />
//                     <DataField label="Kewarganegaraan" value={pendaftar.kewarganegaraan} />
//                     <DataField label="Anak ke" value={pendaftar.anak_ke} />
//                     <DataField label="Jumlah Saudara Kandung" value={pendaftar.jumlah_saudara_kandung} />
//                     <DataField label="Status Anak" value={pendaftar.status_anak} />
//                     <DataField label="Bahasa Sehari-hari" value={pendaftar.bahasa_sehari_hari} />
//                     <DataField label="Berat / Tinggi Badan" value={`${pendaftar.berat_badan || '-'} Kg / ${pendaftar.tinggi_badan || '-'} Cm`} />
//                     <DataField label="Golongan Darah" value={pendaftar.golongan_darah} />
//                     <DataField label="Cita-cita" value={pendaftar.cita_cita} />
//                     <DataField label="Alamat Tempat Tinggal" value={pendaftar.alamat_lengkap} />
//                     <DataField label="Nomor Telepon/HP" value={pendaftar.nomor_telepon} />
//                     <DataField label="Jarak Tempat Tinggal" value={pendaftar.jarak_tempat_tinggal} />
//                 </fieldset>

//                 <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
//                     <legend className="font-semibold text-lg text-gray-700 px-2">B. Orang Tua</legend>
//                     <DataField label="Nama Ayah Kandung" value={pendaftar.nama_ayah_kandung} />
//                     <DataField label="Pendidikan Ayah" value={pendaftar.pendidikan_ayah} />
//                     <DataField label="Pekerjaan Ayah" value={pendaftar.pekerjaan_ayah} />
//                     <hr className="my-4"/>
//                     <DataField label="Nama Ibu Kandung" value={pendaftar.nama_ibu_kandung} />
//                     <DataField label="Pendidikan Ibu" value={pendaftar.pendidikan_ibu} />
//                     <DataField label="Pekerjaan Ibu" value={pendaftar.pekerjaan_ibu} />
//                     <hr className="my-4"/>
//                     <DataField label="Email Kontak Utama" value={pendaftar.email} />
//                 </fieldset>

//                 {pendaftar.wali_nama && (
//                     <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
//                         <legend className="font-semibold text-lg text-gray-700 px-2">C. Wali Anak</legend>
//                         <DataField label="Nama Wali" value={pendaftar.wali_nama} />
//                         <DataField label="Pendidikan Wali" value={pendaftar.wali_pendidikan} />
//                         <DataField label="Hubungan dengan Keluarga" value={pendaftar.wali_hubungan} />
//                         <DataField label="Pekerjaan Wali" value={pendaftar.wali_pekerjaan} />
//                     </fieldset>
//                 )}
//             </div>

//             <hr className="my-8" />

//             <div>
//                 <h3 className="text-lg font-semibold mb-2">Status & Aksi Pendaftaran</h3>
//                 <p className="mb-4">
//                     Status Saat Ini:{" "}
//                     <span className={`px-2 py-1 rounded text-xs font-semibold
//                         ${pendaftar.status_pendaftaran === "Akun Dibuat"
//                             ? "bg-green-100 text-green-700"
//                             : pendaftar.status_pendaftaran === "Diterima"
//                             ? "bg-blue-100 text-blue-700"
//                             : pendaftar.status_pendaftaran === "Ditolak"
//                             ? "bg-red-100 text-red-700"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`
//                     }>
//                         {pendaftar.status_pendaftaran}
//                     </span>
//                 </p>
                
//                 {canBeProcessed && (
//                     <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
//                         <p className="mb-3">Pendaftar ini sedang menunggu konfirmasi. Klik tombol di bawah untuk menerima siswa dan secara otomatis membuatkan akun portal untuk orang tua.</p>
//                         <ProcessRegistrationButton pendaftar={pendaftar} />
//                     </div>
//                 )}

//                 {isProcessed && (
//                     <p className="text-green-700 font-bold mt-6">
//                         ✓ Proses penerimaan untuk siswa ini sudah selesai.
//                     </p>
//                 )}
                
//                 {isRejected && (
//                     <p className="text-red-700 font-bold mt-6">
//                         Pendaftaran untuk siswa ini telah ditolak.
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// }

