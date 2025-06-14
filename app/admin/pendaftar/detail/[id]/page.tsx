// app/admin/pendaftar/detail/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateStatusPendaftaranAction } from "../../actions";
import CreateAccountButton from "./CreateAccountButton";

type DetailPageProps = { params: Promise<{ id: string }> };

function DataField({ label, value }: { label: string, value: string | null | undefined }) {
    return (
        <div>
            <strong>{label}</strong>
            <p>{value || '-'}</p>
        </div>
    );
}

export default async function DetailPendaftarPage({ params }: DetailPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Ambil semua data pendaftar karena kita butuh banyak field untuk aksi
    const { data: pendaftar, error } = await supabase
        .from('pendaftar')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !pendaftar) {
        console.error("Gagal menemukan pendaftar:", error);
        return redirect('/admin/pendaftar');
    }

    // Bind action untuk update status dengan pendaftarId
    const actionWithId = async (formData: FormData) => {
        await updateStatusPendaftaranAction(pendaftar.id, formData);
    };

    // Tentukan apakah tombol "Buat Akun" harus ditampilkan
    const showCreateAccountButton = pendaftar.status_pendaftaran === 'Diterima';
    const accountAlreadyExists = pendaftar.status_pendaftaran === 'Akun Dibuat';

    return (
        <div>
            <Link href="/admin/pendaftar">← Kembali ke Daftar Pendaftar</Link>
            <h1>Detail Pendaftar: {pendaftar.nama_lengkap}</h1>

            {/* Bagian untuk menampilkan data pendaftar (tidak berubah) */}
            <div>
                <div>
                    <h3>Data Calon Siswa</h3>
                    <DataField label="Nama Lengkap" value={pendaftar.nama_lengkap} />
                    <DataField label="Nama Panggilan" value={pendaftar.nama_panggilan} />
                    <DataField label="Jenis Kelamin" value={pendaftar.jenis_kelamin} />
                    <DataField label="Tempat, Tanggal Lahir" value={`${pendaftar.tempat_lahir}, ${new Date(pendaftar.tanggal_lahir).toLocaleDateString('id-ID')}`} />
                    <DataField label="Agama" value={pendaftar.agama} />
                    <DataField label="Alamat" value={pendaftar.alamat_lengkap} />
                </div>
                <div>
                    <h3>Data Orang Tua/Wali</h3>
                    <DataField label="Nama Orang Tua/Wali" value={pendaftar.nama_orang_tua} />
                    <DataField label="Pekerjaan" value={pendaftar.pekerjaan_orang_tua} />
                    <DataField label="Nomor Telepon (WA)" value={pendaftar.nomor_telepon} />
                    <DataField label="Email" value={pendaftar.email} />
                </div>
            </div>

            <hr />

            {/* Bagian untuk memproses pendaftaran */}
            <div>
                <h3>Proses Pendaftaran</h3>
                <p>Status Saat Ini: <strong>{pendaftar.status_pendaftaran}</strong></p>
                
                {/* Form untuk mengubah status */}
                <form action={actionWithId}>
                    <label htmlFor="status">Ubah Status Menjadi:</label>
                    <select name="newStatus" defaultValue={pendaftar.status_pendaftaran || ''}>
                        <option>Menunggu Konfirmasi</option>
                        <option>Diterima</option>
                        <option>Ditolak</option>
                        <option disabled>Akun Dibuat</option>
                    </select>
                    <button type="submit">Simpan Perubahan</button>
                </form>
                
                {/* Bagian Aksi Lanjutan untuk membuat akun */}
                <div style={{ marginTop: '1.5rem' }}>
                    <h4>Aksi Lanjutan</h4>
                    {showCreateAccountButton && (
                        <div>
                            <p>Status pendaftar adalah "Diterima". Anda sekarang dapat membuatkan akun portal untuk orang tua.</p>
                            <CreateAccountButton pendaftar={pendaftar} />
                        </div>
                    )}
                    {accountAlreadyExists && (
                        <p style={{ color: 'green', fontWeight: 'bold' }}>
                            ✓ Akun portal untuk pendaftar ini sudah berhasil dibuat.
                        </p>
                    )}
                    {!showCreateAccountButton && !accountAlreadyExists && (
                        <p style={{ color: '#666' }}>
                            Ubah status menjadi "Diterima" terlebih dahulu untuk dapat membuat akun portal.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}