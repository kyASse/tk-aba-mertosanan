// app/pendaftaran/page.tsx
import { createClient } from "@/lib/supabase/server";
import PendaftaranForm from "./PendaftaranForm";

// Tipe untuk data biaya
type Biaya = {
    komponen_biaya: string | null;
    biaya_kb: number | null;
    biaya_tka: number | null;
    biaya_tkb: number | null;
};

// CSS Styles Sederhana
const styles = {
    container: { fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    section: { marginBottom: '3rem', padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' },
    h1: { color: '#333', borderBottom: '2px solid #f0ad4e', paddingBottom: '0.5rem' },
    h2: { color: '#555', marginTop: 0 },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '1rem' },
    th: { backgroundColor: '#f0ad4e', color: 'white', padding: '12px', textAlign: 'left' as const },
    td: { padding: '12px', borderBottom: '1px solid #ddd' },
    button: { backgroundColor: '#5cb85c', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
};

export default async function PendaftaranPage() {
    const supabase = await createClient();

    const { data: persyaratan } = await supabase
        .from('konten_halaman')
        .select('judul, isi')
        .eq('slug', 'persyaratan-pendaftaran')
        .single();
    
    const { data: biaya } = await supabase
        .from('biaya_pendaftaran')
        .select('komponen_biaya, biaya_kb, biaya_tka, biaya_tkb');

    const { data: formulirOffline } = await supabase
        .from('konten_halaman')
        .select('isi')
        .eq('slug', 'link-download-formulir')
        .single();

    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Pendaftaran Siswa Baru</h1>
            
            <section style={styles.section}>
                <h2 style={styles.h2}>{persyaratan?.judul || 'Persyaratan Pendaftaran'}</h2>
                <div dangerouslySetInnerHTML={{ __html: persyaratan?.isi || '<p>Informasi persyaratan akan segera tersedia.</p>' }} />
            </section>

            <section style={styles.section}>
                <h2 style={styles.h2}>Biaya Pendidikan</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Komponen Biaya</th>
                            <th style={styles.th}>Kelompok Bermain</th>
                            <th style={styles.th}>TK A</th>
                            <th style={styles.th}>TK B</th>
                        </tr>
                    </thead>
                    <tbody>
                        {biaya?.map((item: Biaya, index) => (
                            <tr key={index}>
                                <td style={styles.td}>{item.komponen_biaya}</td>
                                <td style={styles.td}>Rp {item.biaya_kb?.toLocaleString('id-ID')}</td>
                                <td style={styles.td}>Rp {item.biaya_tka?.toLocaleString('id-ID')}</td>
                                <td style={styles.td}>Rp {item.biaya_tkb?.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section style={styles.section}>
                <h2 style={styles.h2}>Formulir Pendaftaran Online</h2>
                <p>Silakan isi formulir di bawah ini dengan data yang benar dan lengkap.</p>
                <PendaftaranForm />
            </section>

            <section style={styles.section}>
                <h2 style={styles.h2}>Pendaftaran Offline</h2>
                <p>Anda juga bisa mendaftar secara offline dengan mengunduh dan mengisi formulir di bawah ini, lalu menyerahkannya langsung ke sekolah.</p>
                <a href={formulirOffline?.isi || '#'} target="_blank" rel="noopener noreferrer">
                    <button style={styles.button}>Unduh Formulir Pendaftaran</button>
                </a>
            </section>
        </div>
    );
}
