// app/pendaftaran/PendaftaranForm.tsx
'use client';

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

// CSS Styles untuk Form agar terlihat rapi
const formStyles = {
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' },
    select: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', backgroundColor: 'white' },
    textarea: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit' },
    button: { backgroundColor: '#f0ad4e', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    error: { color: 'red', marginTop: '1rem', textAlign: 'center' as const },
    successBox: { padding: '2rem', border: '2px solid #5cb85c', backgroundColor: '#f0fff4', borderRadius: '8px', color: '#155724' },
    successTitle: { marginTop: 0, color: '#155724' },
    pre: { padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', border: '1px solid #ddd' }
};

export default function PendaftaranForm() {
    // State untuk menampung semua data dari formulir
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nama_panggilan: '',
        jenis_kelamin: 'Laki-laki',
        tempat_lahir: '',
        tanggal_lahir: '',
        alamat_lengkap: '',
        agama: '',
        nama_orang_tua: '',
        pekerjaan_orang_tua: '',
        nomor_telepon: '',
        email: '',
    });
    
    // State untuk UI (loading, error, success)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const supabase = createClient();

    // Fungsi generik untuk menangani perubahan pada semua input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fungsi untuk menangani pengiriman formulir
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Mengirim data ke tabel 'pendaftar' di Supabase
            const { error: insertError } = await supabase
                .from('pendaftar')
                .insert([{ ...formData, jalur_pendaftaran: 'Online' }]);
            
            if (insertError) throw insertError;
            
            // Jika berhasil, ubah state untuk menampilkan pesan sukses
            setIsSuccess(true);
        } catch (err: any) {
            setError("Gagal mengirim pendaftaran: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Jika pendaftaran berhasil, tampilkan pesan ini
    if (isSuccess) {
        return (
            <div style={formStyles.successBox}>
                <h2 style={formStyles.successTitle}>Pendaftaran Berhasil!</h2>
                <p>Terima kasih telah mendaftarkan putra/putri Anda.</p>
                <p>
                    <strong>Langkah selanjutnya:</strong> Silakan lakukan konfirmasi pendaftaran dan pembayaran
                    ke nomor WhatsApp sekolah di <strong>0812-3456-7890</strong> (ganti dengan nomor asli) dengan format:
                </p>
                <pre style={formStyles.pre}>
                    KONFIRMASI PENDAFTARAN - {formData.nama_lengkap}
                </pre>
                <p>Tim kami akan segera memproses data Anda.</p>
            </div>
        );
    }

    // Jika belum, tampilkan formulir
    return (
        <form onSubmit={handleSubmit} style={formStyles.form}>
            {/* ======================= DATA ANAK ======================= */}
            <div style={formStyles.inputGroup}>
                <label htmlFor="nama_lengkap" style={formStyles.label}>Nama Lengkap Anak</label>
                <input type="text" name="nama_lengkap" id="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required style={formStyles.input} />
            </div>
            
            <div style={formStyles.inputGroup}>
                <label htmlFor="nama_panggilan" style={formStyles.label}>Nama Panggilan</label>
                <input type="text" name="nama_panggilan" id="nama_panggilan" value={formData.nama_panggilan} onChange={handleChange} required style={formStyles.input} />
            </div>
            
            <div style={formStyles.inputGroup}>
                <label htmlFor="jenis_kelamin" style={formStyles.label}>Jenis Kelamin</label>
                <select name="jenis_kelamin" id="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} required style={formStyles.select}>
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                </select>
            </div>
            
            <div style={formStyles.inputGroup}>
                <label htmlFor="tempat_lahir" style={formStyles.label}>Tempat Lahir</label>
                <input type="text" name="tempat_lahir" id="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} required style={formStyles.input} />
            </div>
            
            <div style={formStyles.inputGroup}>
                <label htmlFor="tanggal_lahir" style={formStyles.label}>Tanggal Lahir</label>
                <input type="date" name="tanggal_lahir" id="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} required style={formStyles.input} />
            </div>
            
            <div style={formStyles.inputGroup}>
                <label htmlFor="agama" style={formStyles.label}>Agama</label>
                <select name="agama" id="agama" value={formData.agama} onChange={handleChange} required style={formStyles.select}>
                    <option value="">-- Pilih Agama --</option>
                    <option>Islam</option>
                    <option>Kristen Protestan</option>
                    <option>Kristen Katolik</option>
                    <option>Hindu</option>
                    <option>Buddha</option>
                    <option>Konghucu</option>
                </select>
            </div>

            <div style={formStyles.inputGroup}>
                <label htmlFor="alamat_lengkap" style={formStyles.label}>Alamat Lengkap</label>
                <textarea name="alamat_lengkap" id="alamat_lengkap" value={formData.alamat_lengkap} onChange={handleChange} required style={formStyles.textarea} rows={3} />
            </div>
            
            {/* ======================= DATA ORANG TUA / WALI ======================= */}
            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1rem 0' }} />

            <div style={formStyles.inputGroup}>
                <label htmlFor="nama_orang_tua" style={formStyles.label}>Nama Orang Tua/Wali</label>
                <input type="text" name="nama_orang_tua" id="nama_orang_tua" value={formData.nama_orang_tua} onChange={handleChange} required style={formStyles.input} />
            </div>
            
            <div style={formStyles.inputGroup}>
                <label htmlFor="pekerjaan_orang_tua" style={formStyles.label}>Pekerjaan Orang Tua/Wali</label>
                <input type="text" name="pekerjaan_orang_tua" id="pekerjaan_orang_tua" value={formData.pekerjaan_orang_tua} onChange={handleChange} required style={formStyles.input} />
            </div>
            
            <div style={formStyles.inputGroup}>
                <label htmlFor="nomor_telepon" style={formStyles.label}>Nomor Telepon (WhatsApp Aktif)</label>
                <input type="tel" name="nomor_telepon" id="nomor_telepon" value={formData.nomor_telepon} onChange={handleChange} required style={formStyles.input} placeholder="Contoh: 081234567890" />
            </div>
            
            <div style={formStyles.inputGroup}>
                <label htmlFor="email" style={formStyles.label}>Alamat Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required style={formStyles.input} placeholder="contoh@email.com" />
            </div>

            {error && <p style={formStyles.error}>{error}</p>}
            
            <button type="submit" disabled={isLoading} style={formStyles.button}>
                {isLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
            </button>
        </form>
    );
}