// app/pendaftaran/page.tsx
import { createClient } from "@/lib/supabase/server";
import PendaftaranForm from "./PendaftaranForm";

// Tipe untuk data biaya
type BiayaItem = {
    komponen_biaya: string | null;
    biaya_putra: number | null;
    biaya_putri: number | null;
};

// CSS Styles Sederhana untuk kejelasan
const styles = {
    container: { fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    section: { marginBottom: '3rem', padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' },
    h1: { color: '#333', borderBottom: '2px solid #f0ad4e', paddingBottom: '0.5rem' },
    h2: { color: '#555', marginTop: 0 },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '1rem' },
    th: { backgroundColor: '#f0ad4e', color: 'white', padding: '12px', textAlign: 'left' as const },
    td: { padding: '12px', borderBottom: '1px solid #ddd' },
    totalRow: { fontWeight: 'bold', backgroundColor: '#f2f2f2' },
};

export default async function PendaftaranPage() {
    const supabase = await createClient();

    // Ambil semua data yang dibutuhkan secara paralel
    const persyaratanPromise = supabase.from('konten_halaman').select('judul, isi').eq('slug', 'persyaratan-pendaftaran').single();
    const biayaPromise = supabase.from('biaya_pendaftaran').select('*').order('id');
    const sppPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'catatan-spp').single();
    
    const [
        { data: persyaratan }, 
        { data: biaya }, 
        { data: catatanSpp }
    ] = await Promise.all([persyaratanPromise, biayaPromise, sppPromise]);

    // Hitung total biaya
    const totalPutra = biaya?.reduce((acc, item) => acc + (item.biaya_putra || 0), 0);
    const totalPutri = biaya?.reduce((acc, item) => acc + (item.biaya_putri || 0), 0);

    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Informasi & Pendaftaran Siswa Baru</h1>
            
            <section style={styles.section}>
                <h2 style={styles.h2}>{persyaratan?.judul || 'Persyaratan Pendaftaran'}</h2>
                <div dangerouslySetInnerHTML={{ __html: persyaratan?.isi || '<p>Informasi persyaratan akan segera tersedia.</p>' }} />
            </section>

            {/* Menampilkan Tabel Rincian Biaya Dinamis */}
            <section style={styles.section}>
                <h2 style={styles.h2}>Rincian Keuangan Anak Baru</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Komponen Biaya</th>
                            <th style={styles.th}>PUTRA (Rp)</th>
                            <th style={styles.th}>PUTRI (Rp)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {biaya?.map((item: BiayaItem) => (
                            <tr key={item.komponen_biaya}>
                                <td style={styles.td}>{item.komponen_biaya}</td>
                                <td style={styles.td}>{item.biaya_putra?.toLocaleString('id-ID')}</td>
                                <td style={styles.td}>{item.biaya_putri?.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        <tr style={styles.totalRow}>
                            <td style={styles.td}>JUMLAH</td>
                            <td style={styles.td}>{totalPutra?.toLocaleString('id-ID')}</td>
                            <td style={styles.td}>{totalPutri?.toLocaleString('id-ID')}</td>
                        </tr>
                    </tbody>
                </table>
                <p style={{ marginTop: '1rem', fontStyle: 'italic' }}><strong>{catatanSpp?.isi}</strong></p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.h2}>Formulir Pendaftaran Online</h2>
                <p>Silakan isi formulir di bawah ini dengan data yang benar dan lengkap.</p>
                <PendaftaranForm />
            </section>
        </div>
    );
}