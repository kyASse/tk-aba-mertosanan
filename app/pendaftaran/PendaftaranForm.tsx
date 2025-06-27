// app/pendaftaran/PendaftaranForm.tsx
'use client';

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const formStyles = {
    form: { display: 'flex', flexDirection: 'column' as const, gap: 32 },
    fieldset: { border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' },
    legend: { fontWeight: 'bold', fontSize: '1.2rem', padding: '0 0.5rem', color: '#333' },
    inputGroup: { display: 'flex', flexDirection: 'column' as const, marginBottom: '1rem' },
    label: { marginBottom: '0.5rem', fontWeight: 'normal', color: '#444' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' },
    select: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', backgroundColor: 'white' },
    textarea: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit' },
    button: { backgroundColor: '#f0ad4e', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    error: { color: 'red', marginTop: '1rem', textAlign: 'center' as const },
    successBox: { padding: '2rem', border: '2px solid #5cb85c', backgroundColor: '#f0fff4', borderRadius: '8px', color: '#155724' },
    successTitle: { marginTop: 0, color: '#155724' },
    pre: { padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' as const, border: '1px solid #ddd' }
};

export default function PendaftaranForm() {
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nama_panggilan: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        agama: '',
        kewarganegaraan: '',
        anak_ke: '',
        jumlah_saudara_kandung: '',
        status_anak: '',
        bahasa_sehari_hari: '',
        berat_badan: '',
        tinggi_badan: '',
        golongan_darah: '',
        cita_cita: '',
        alamat_lengkap: '',
        nomor_telepon: '',
        jarak_tempat_tinggal: '',
        nama_ayah_kandung: '',
        pendidikan_ayah: '',
        pekerjaan_ayah: '',
        nama_ibu_kandung: '',
        pendidikan_ibu: '',
        pekerjaan_ibu: '',
        email: '',
        wali_nama: '',
        wali_pendidikan: '',
        wali_hubungan: '',
        wali_pekerjaan: '',
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            // Filter out empty values for number fields so they are sent as NULL
            const dataToSubmit = {
                ...formData,
                anak_ke: formData.anak_ke === '' ? null : parseInt(formData.anak_ke),
                jumlah_saudara_kandung: formData.jumlah_saudara_kandung === '' ? null : parseInt(formData.jumlah_saudara_kandung),
                berat_badan: formData.berat_badan === '' ? null : parseInt(formData.berat_badan),
                tinggi_badan: formData.tinggi_badan === '' ? null : parseInt(formData.tinggi_badan),
                jalur_pendaftaran: 'Online',
            };
            const { error: insertError } = await supabase.from('pendaftar').insert([dataToSubmit]);
            if (insertError) throw insertError;
            setIsSuccess(true);
        } catch (err: any) {
            setError("Gagal mengirim pendaftaran: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div style={formStyles.successBox}>
                <h2 style={formStyles.successTitle}>Pendaftaran Berhasil!</h2>
                <p>Terima kasih. Langkah selanjutnya, silakan konfirmasi pendaftaran ke nomor WhatsApp sekolah di <strong>0812-3456-7890</strong> (ganti nomor) dengan format:</p>
                <pre style={formStyles.pre}>KONFIRMASI PENDAFTARAN - {formData.nama_lengkap}</pre>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={formStyles.form}>
            <fieldset style={formStyles.fieldset}>
                <legend style={formStyles.legend}>A. Keterangan Anak</legend>
                <div style={formStyles.inputGroup}><label htmlFor="nama_lengkap">1. Nama Lengkap</label><input style={formStyles.input} type="text" name="nama_lengkap" id="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required /></div>
                <div style={formStyles.inputGroup}><label htmlFor="nama_panggilan">2. Nama Panggilan</label><input style={formStyles.input} type="text" name="nama_panggilan" id="nama_panggilan" value={formData.nama_panggilan} onChange={handleChange} required /></div>
                <div style={formStyles.inputGroup}><label htmlFor="jenis_kelamin">3. Jenis Kelamin</label><select style={formStyles.select} name="jenis_kelamin" id="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} required><option>Laki-laki</option><option>Perempuan</option></select></div>
                <div style={formStyles.inputGroup}><label htmlFor="tempat_lahir">4. Tempat, Tgl Lahir</label><div style={{display: 'flex', gap: '10px'}}><input style={formStyles.input} type="text" name="tempat_lahir" placeholder="Tempat Lahir" value={formData.tempat_lahir} onChange={handleChange} required /><input style={formStyles.input} type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} required /></div></div>
                <div style={formStyles.inputGroup}><label htmlFor="agama">5. Agama</label><input style={formStyles.input} type="text" name="agama" id="agama" value={formData.agama} onChange={handleChange} required /></div>
                <div style={formStyles.inputGroup}><label htmlFor="kewarganegaraan">6. Kewarganegaraan</label><select style={formStyles.select} name="kewarganegaraan" id="kewarganegaraan" value={formData.kewarganegaraan} onChange={handleChange}><option>WNI</option><option>WNA</option></select></div>
                <div style={formStyles.inputGroup}><label htmlFor="anak_ke">7. Anak ke</label><input style={formStyles.input} type="number" name="anak_ke" id="anak_ke" value={formData.anak_ke} onChange={handleChange} /></div>
                <div style={formStyles.inputGroup}><label htmlFor="jumlah_saudara_kandung">8. Jumlah saudara kandung</label><input style={formStyles.input} type="number" name="jumlah_saudara_kandung" id="jumlah_saudara_kandung" value={formData.jumlah_saudara_kandung} onChange={handleChange} /></div>
                <div style={formStyles.inputGroup}><label htmlFor="status_anak">9. Status Anak</label><input style={formStyles.input} type="text" name="status_anak" id="status_anak" placeholder="Contoh: Anak Kandung" value={formData.status_anak} onChange={handleChange} /></div>
                <div style={formStyles.inputGroup}><label htmlFor="bahasa_sehari_hari">10. Bahasa sehari-hari</label><input style={formStyles.input} type="text" name="bahasa_sehari_hari" id="bahasa_sehari_hari" value={formData.bahasa_sehari_hari} onChange={handleChange} /></div>
                <div style={formStyles.inputGroup}><label htmlFor="berat_badan">11. Berat / Tinggi Badan</label><div style={{display: 'flex', gap: '10px'}}><input style={formStyles.input} type="number" name="berat_badan" placeholder="... Kg" value={formData.berat_badan} onChange={handleChange} /><input style={formStyles.input} type="number" name="tinggi_badan" placeholder="... Cm" value={formData.tinggi_badan} onChange={handleChange} /></div></div>
                <div style={formStyles.inputGroup}><label htmlFor="golongan_darah">12. Golongan Darah</label><select style={formStyles.select} name="golongan_darah" id="golongan_darah" value={formData.golongan_darah} onChange={handleChange}><option value="">-- Pilih --</option><option>A</option><option>B</option><option>AB</option><option>O</option></select></div>
                <div style={formStyles.inputGroup}><label htmlFor="cita_cita">14. Cita-cita</label><input style={formStyles.input} type="text" name="cita_cita" id="cita_cita" value={formData.cita_cita} onChange={handleChange} /></div>
                <div style={formStyles.inputGroup}><label htmlFor="alamat_lengkap">15. Alamat Tempat Tinggal</label><textarea style={formStyles.textarea} name="alamat_lengkap" id="alamat_lengkap" value={formData.alamat_lengkap} onChange={handleChange} required rows={3}/></div>
                <div style={formStyles.inputGroup}><label htmlFor="nomor_telepon">16. Nomor Telepon/HP</label><input style={formStyles.input} type="tel" name="nomor_telepon" id="nomor_telepon" value={formData.nomor_telepon} onChange={handleChange} required /></div>
                <div style={formStyles.inputGroup}><label htmlFor="jarak_tempat_tinggal">17. Jarak tempat tinggal</label><input style={formStyles.input} type="text" name="jarak_tempat_tinggal" id="jarak_tempat_tinggal" placeholder="Contoh: ± 1 Km" value={formData.jarak_tempat_tinggal} onChange={handleChange} /></div>
            </fieldset>

            <fieldset style={formStyles.fieldset}>
                <legend style={formStyles.legend}>B. Orang Tua</legend>
                <p><strong>15. Nama Orang Tua</strong></p>
                <div style={formStyles.inputGroup}><label htmlFor="nama_ayah_kandung">- Ayah Kandung</label><input style={formStyles.input} type="text" name="nama_ayah_kandung" id="nama_ayah_kandung" value={formData.nama_ayah_kandung} onChange={handleChange} /></div>
                <div style={formStyles.inputGroup}><label htmlFor="nama_ibu_kandung">- Ibu Kandung</label><input style={formStyles.input} type="text" name="nama_ibu_kandung" id="nama_ibu_kandung" value={formData.nama_ibu_kandung} onChange={handleChange} /></div>
                <p><strong>16. Pendidikan Tertinggi</strong></p>
                <div style={formStyles.inputGroup}><label htmlFor="pendidikan_ayah">- Ayah Kandung</label><input style={formStyles.input} type="text" name="pendidikan_ayah" id="pendidikan_ayah" value={formData.pendidikan_ayah} onChange={handleChange} /></div>
                <div style={formStyles.inputGroup}><label htmlFor="pendidikan_ibu">- Ibu Kandung</label><input style={formStyles.input} type="text" name="pendidikan_ibu" id="pendidikan_ibu" value={formData.pendidikan_ibu} onChange={handleChange} /></div>
                <p><strong>17. Pekerjaan</strong></p>
                <div style={formStyles.inputGroup}><label htmlFor="pekerjaan_ayah">- Ayah Kandung</label><input style={formStyles.input} type="text" name="pekerjaan_ayah" id="pekerjaan_ayah" value={formData.pekerjaan_ayah} onChange={handleChange} /></div>
                <div style={formStyles.inputGroup}><label htmlFor="pekerjaan_ibu">- Ibu Kandung</label><input style={formStyles.input} type="text" name="pekerjaan_ibu" id="pekerjaan_ibu" value={formData.pekerjaan_ibu} onChange={handleChange} /></div>
                <div style={formStyles.inputGroup}><label htmlFor="email">Alamat Email (untuk Portal Orang Tua)</label><input style={formStyles.input} type="email" name="email" id="email" value={formData.email} onChange={handleChange} required placeholder="contoh@email.com"/></div>
            </fieldset>

            <fieldset style={formStyles.fieldset}>
                <legend style={formStyles.legend}>C. Wali Anak (diisi jika tinggal bersama wali)</legend>
                 <div style={formStyles.inputGroup}><label htmlFor="wali_nama">18. Nama Wali</label><input style={formStyles.input} type="text" name="wali_nama" id="wali_nama" value={formData.wali_nama} onChange={handleChange} /></div>
                 <div style={formStyles.inputGroup}><label htmlFor="wali_pendidikan">- Pendidikan Tertinggi Wali</label><input style={formStyles.input} type="text" name="wali_pendidikan" id="wali_pendidikan" value={formData.wali_pendidikan} onChange={handleChange} /></div>
                 <div style={formStyles.inputGroup}><label htmlFor="wali_hubungan">- Hubungan dengan Keluarga</label><input style={formStyles.input} type="text" name="wali_hubungan" id="wali_hubungan" value={formData.wali_hubungan} onChange={handleChange} /></div>
                 <div style={formStyles.inputGroup}><label htmlFor="wali_pekerjaan">- Pekerjaan Wali</label><input style={formStyles.input} type="text" name="wali_pekerjaan" id="wali_pekerjaan" value={formData.wali_pekerjaan} onChange={handleChange} /></div>
            </fieldset>
            
            {error && <p style={formStyles.error}>{error}</p>}
            
            <button type="submit" disabled={isLoading} style={formStyles.button}>
                {isLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
            </button>
        </form>
    );
}