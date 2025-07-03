import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProcessRegistrationButton from "./ProcessRegistrationButton";

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
            </div>

            <hr className="my-8" />

            <div>
                <h3 className="text-lg font-semibold mb-2">Status & Aksi Pendaftaran</h3>
                <p className="mb-4">
                    Status Saat Ini:{" "}
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${pendaftar.status_pendaftaran === "Akun Dibuat"
                            ? "bg-green-100 text-green-700"
                            : pendaftar.status_pendaftaran === "Diterima"
                            ? "bg-blue-100 text-blue-700"
                            : pendaftar.status_pendaftaran === "Ditolak"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`
                    }>
                        {pendaftar.status_pendaftaran}
                    </span>
                </p>
                
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
            </div>
        </div>
    );
}