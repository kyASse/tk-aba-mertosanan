// app/kalender-akademik/page.tsx
import { createClient } from "@/lib/supabase/server";
import Kalender from "./kalender"; // Komponen kalender interaktif

export default async function KalenderAkademikPage() {
    const supabase = await createClient();
    
    // Ambil semua data kegiatan dari database
    const { data: events } = await supabase
        .from('kalender_akademik')
        .select('*');

    return (
        <div style={{ fontFamily: 'sans-serif', maxWidth: '700px', margin: '2rem auto' }}>
            <h1 style={{ textAlign: 'center' }}>Kalender Akademik</h1>
            <p style={{ textAlign: 'center', color: '#666' }}>
                Jadwal kegiatan akademik dan acara penting di TK ABA Mertosanan sepanjang tahun ajaran
            </p>
            {/* Teruskan data event ke komponen klien */}
            <Kalender events={events || []} />
        </div>
    );
}