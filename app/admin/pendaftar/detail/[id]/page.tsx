import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProcessRegistrationButton from "./ProcessRegistrationButton";
import StatusSelect from "./StatusSelect";
import EditPendaftarButton from "./EditPendaftarButton";
import WhatsAppButton from "./WhatsAppButton";

type DetailPageProps = { params: Promise<{ id: string }> };

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

    const kebutuhanKhusus = Array.isArray(pendaftar.jenis_kebutuhan_khusus)
        ? pendaftar.jenis_kebutuhan_khusus
        : (pendaftar.jenis_kebutuhan_khusus ? JSON.parse(pendaftar.jenis_kebutuhan_khusus) : []);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 font-sans">
            <Link href="/admin/pendaftar" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Kembali ke Daftar Pendaftar
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

                {pendaftar.memiliki_kebutuhan_khusus && (
                    <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
                        <legend className="font-semibold text-lg text-gray-700 px-2">D. Kebutuhan Khusus</legend>
                        <DataField label="Memiliki Kebutuhan Khusus" value={pendaftar.memiliki_kebutuhan_khusus ? "Ya" : "Tidak"} />
                        {kebutuhanKhusus && kebutuhanKhusus.length > 0 && (
                            <DataField
                                label="Jenis Kebutuhan Khusus"
                                value={kebutuhanKhusus.map((id: string) => jenisKebutuhanKhususItems.find(i => i.id === id)?.label || id).join(", ")}
                            />
                        )}
                        <DataField label="Deskripsi Kebutuhan Khusus" value={pendaftar.deskripsi_kebutuhan_khusus} />
                        {pendaftar.dokumen_pendukung_url && (
                            <div className="mb-3">
                                <span className="block text-xs text-gray-500 mb-1 font-semibold">Dokumen Pendukung</span>
                                <a href={pendaftar.dokumen_pendukung_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download Dokumen</a>
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
                    <StatusSelect id={pendaftar.id} value={pendaftar.status_pendaftaran} />
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 border rounded-lg space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Aksi Komunikasi</h4>
                        <p className="text-sm text-gray-600 mb-3">Kirim pesan cepat ke orang tua pendaftar untuk konfirmasi.</p>
                        <WhatsAppButton 
                            namaOrangTua={pendaftar.nama_ayah_kandung || pendaftar.nama_ibu_kandung || pendaftar.wali_nama}
                            namaAnak={pendaftar.nama_lengkap}
                            nomorTelepon={pendaftar.nomor_telepon}
                        />
                    </div>
                    
                    {canBeProcessed && (
                        <div className="pt-4 border-t">
                            <h4 className="font-semibold text-blue-800">Aksi Final</h4>
                            <p className="text-sm text-blue-700 mb-3">Terima pendaftar dan buatkan akun portal dalam satu klik.</p>
                            <ProcessRegistrationButton pendaftar={pendaftar} />
                        </div>
                    )}
                </div>

                {isProcessed && (
                    <p className="text-green-700 font-bold mt-6">✓ Proses penerimaan untuk siswa ini sudah selesai.</p>
                )}
                {isRejected && (
                    <p className="text-red-700 font-bold mt-6">Pendaftaran untuk siswa ini telah ditolak.</p>
                )}
                {isRevisi && (
                    <div className="mt-6">
                        <EditPendaftarButton pendaftar={pendaftar} />
                    </div>
                )}
            </div>
        </div>
    );
}