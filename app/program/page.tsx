// app/program-kurikulum/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProgramKelasTabs from "./ProgramKelasTabs"; 
import Kalender from ".././kalender-akademik/kalender"; // Komponen kalender interaktif

// Komponen helper untuk styling, agar JSX lebih bersih
const Section = ({ children }: { children: React.ReactNode }) => (
    <section style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        {children}
    </section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>{children}</h2>
);

const SectionSubtitle = ({ children }: { children: React.ReactNode }) => (
    <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>{children}</p>
);

export default async function ProgramKurikulumPage() {
    const supabase = await createClient();

    // Ambil semua data yang dibutuhkan secara paralel
    const programPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'program-pendidikan-deskripsi').single();
    const kegiatanHarianPromise = supabase.from('kegiatan_harian').select('*').order('urutan');
    const eskulPromise = supabase.from('ekstrakurikuler').select('*');
    const kalenderPromise = supabase.from('kalender_akademik').select('*');
    
    // Ambil data untuk setiap tab kelas
    const kbPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'program-kelas-kb').single();
    const tkaPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'program-kelas-tka').single();
    const tkbPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'program-kelas-tkb').single();

    const [
        { data: programData },
        { data: kegiatanHarian },
        { data: eskul },
        { data: kalenderEvents },
        { data: kbData },
        { data: tkaData },
        { data: tkbData }
    ] = await Promise.all([programPromise, kegiatanHarianPromise, eskulPromise, kalenderPromise, kbPromise, tkaPromise, tkbPromise]);
    
    // Gabungkan data kelas untuk diteruskan ke komponen tab
    const kelasData = {
        kb: kbData?.isi,
        tka: tkaData?.isi,
        tkb: tkbData?.isi
    };

    return (
        <div>
            {/* Bagian Hero (Header Halaman) */}
            <div style={{ backgroundColor: '#e0f2f1', padding: '60px 20px', textAlign: 'center' }}>
                <p>Beranda {'>'} Program & Kurikulum</p>
                <h1 style={{ fontSize: '3.5rem' }}>Program & Kurikulum</h1>
                <p>Melihat keseruan anak-anak belajar dan bermain di TK ABA Mertosanan</p>
            </div>

            {/* Program Pendidikan */}
            <Section>
                <SectionTitle>Program Pendidikan</SectionTitle>
                <div dangerouslySetInnerHTML={{ __html: programData?.isi || '' }} />
            </Section>

            {/* Program Kelas */}
            <div style={{ backgroundColor: '#f0fdf4' }}>
                <Section>
                    <SectionTitle>Program Kelas</SectionTitle>
                    <ProgramKelasTabs data={kelasData} />
                </Section>
            </div>

            {/* Kegiatan Harian */}
            <Section>
                <SectionTitle>Kegiatan Harian</SectionTitle>
                <SectionSubtitle>Aktivitas harian di TK ABA Mertosanan dirancang untuk menstimulasi berbagai aspek perkembangan.</SectionSubtitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {kegiatanHarian?.map(k => (
                        <div key={k.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
                            <p>{k.waktu_mulai} - {k.waktu_selesai}</p>
                            <h3>{k.nama_kegiatan}</h3>
                            <p>{k.deskripsi}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Kegiatan Ekstrakurikuler */}
            <div style={{ backgroundColor: '#fff7f9' }}>
                <Section>
                    <SectionTitle>Kegiatan Ekstrakurikuler</SectionTitle>
                    <SectionSubtitle>Kami menyediakan berbagai kegiatan ekstrakurikuler untuk mengembangkan minat dan bakat anak.</SectionSubtitle>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {eskul?.map(e => (
                             <div key={e.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                                 <img src={e.image_url || ''} alt={e.nama_eskul || ''} style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px'}} />
                                 <h3>{e.nama_eskul}</h3>
                                 <p>{e.deskripsi}</p>
                                 <p style={{ backgroundColor: '#e0f7fa', padding: '8px', borderRadius: '12px' }}>Jadwal: {e.jadwal}</p>
                             </div>
                        ))}
                    </div>
                </Section>
            </div>

            {/* Kalender Akademik */}
            <Section>
                <Kalender events={kalenderEvents || []} />
            </Section>
        </div>
    );
}