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
        <div style={{ marginBottom: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
            <strong style={{ display: 'block', color: '#555', fontSize: '14px', marginBottom: '4px' }}>{label}</strong>
            <span>{value}</span>
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
        <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <Link href="/admin/pendaftar">← Kembali ke Daftar Pendaftar</Link>
            <h1 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Detail Pendaftar: {pendaftar.nama_lengkap}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <fieldset style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
                    <legend>A. Keterangan Anak</legend>
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

                <fieldset style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
                    <legend>B. Orang Tua</legend>
                    <DataField label="Nama Ayah Kandung" value={pendaftar.nama_ayah_kandung} />
                    <DataField label="Pendidikan Ayah" value={pendaftar.pendidikan_ayah} />
                    <DataField label="Pekerjaan Ayah" value={pendaftar.pekerjaan_ayah} />
                    <hr style={{margin: '1rem 0'}}/>
                    <DataField label="Nama Ibu Kandung" value={pendaftar.nama_ibu_kandung} />
                    <DataField label="Pendidikan Ibu" value={pendaftar.pendidikan_ibu} />
                    <DataField label="Pekerjaan Ibu" value={pendaftar.pekerjaan_ibu} />
                    <hr style={{margin: '1rem 0'}}/>
                    <DataField label="Email Kontak Utama" value={pendaftar.email} />
                </fieldset>

                {pendaftar.wali_nama && (
                    <fieldset style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
                        <legend>C. Wali Anak</legend>
                        <DataField label="Nama Wali" value={pendaftar.wali_nama} />
                        <DataField label="Pendidikan Wali" value={pendaftar.wali_pendidikan} />
                        <DataField label="Hubungan dengan Keluarga" value={pendaftar.wali_hubungan} />
                        <DataField label="Pekerjaan Wali" value={pendaftar.wali_pekerjaan} />
                    </fieldset>
                )}
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <div>
                <h3>Status & Aksi Pendaftaran</h3>
                <p>Status Saat Ini: <strong>{pendaftar.status_pendaftaran}</strong></p>
                
                {canBeProcessed && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eef' }}>
                        <p>Pendaftar ini sedang menunggu konfirmasi. Klik tombol di bawah untuk menerima siswa dan secara otomatis membuatkan akun portal untuk orang tua.</p>
                        <ProcessRegistrationButton pendaftar={pendaftar} />
                    </div>
                )}

                {isProcessed && (
                    <p style={{ color: 'green', fontWeight: 'bold', marginTop: '1.5rem' }}>
                        ✓ Proses penerimaan untuk siswa ini sudah selesai.
                    </p>
                )}
                
                {isRejected && (
                    <p style={{ color: 'red', fontWeight: 'bold', marginTop: '1.5rem' }}>
                        Pendaftaran untuk siswa ini telah ditolak.
                    </p>
                )}
            </div>
        </div>
    );
}