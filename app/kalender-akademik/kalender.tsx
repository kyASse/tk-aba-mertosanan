// app/kalender-akademik/Kalender.tsx
'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { id } from 'date-fns/locale';
import { format, isWithinInterval } from 'date-fns';

type Event = {
    id: number;
    nama_kegiatan: string;
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    kategori: string | null;
};

// Definisikan warna untuk setiap kategori
const categoryColors: { [key: string]: string } = {
    'Libur': '#fecaca', // Merah muda
    'Acara Sekolah': '#bbf7d0', // Hijau muda
    'Peringatan': '#bfdbfe', // Biru muda
    'Ujian': '#fed7aa', // Oranye muda
    'Umum': '#e5e7eb', // Abu-abu
};

export default function Kalender({ events }: { events: Event[] }) {
    const [month, setMonth] = useState<Date>(new Date());

    // Buat objek modifiers dinamis dari data event
    const modifiers: any = {};
    events.forEach(event => {
        const category = event.kategori || 'Umum';
        // Pastikan setiap kategori punya modifier sendiri
        if (!modifiers[category]) {
            modifiers[category] = [];
        }

        if (event.tanggal_selesai) {
            // Jika ada rentang tanggal
            const start = new Date(event.tanggal_mulai);
            const end = new Date(event.tanggal_selesai);
            modifiers[category].push({ from: start, to: end });
        } else {
            // Jika hanya satu tanggal
            modifiers[category].push(new Date(event.tanggal_mulai));
        }
    });

    // Buat objek style dinamis dari kategori
    const modifiersStyles: any = {};
    Object.keys(categoryColors).forEach(category => {
        modifiersStyles[category] = {
            backgroundColor: categoryColors[category],
            color: '#1f2937', // Warna teks agar kontras
        };
    });
    
    // Ambil event yang ada di bulan yang sedang ditampilkan untuk legenda
    const eventsInCurrentMonth = events.filter(event => 
        new Date(event.tanggal_mulai).getMonth() === month.getMonth() &&
        new Date(event.tanggal_mulai).getFullYear() === month.getFullYear()
    );
    // Buat daftar legenda yang unik
    const legendItems = [...new Map(eventsInCurrentMonth.map(item => [item.kategori, item])).values()];

    return (
        <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <style>{`
                .rdp-day_selected { background-color: #f0ad4e !important; }
                .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #f3f4f6; }
            `}</style>
            
            <DayPicker
                mode="single"
                month={month}
                onMonthChange={setMonth}
                locale={id}
                showOutsideDays
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                components={{
                    CaptionLabel: () => (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                           <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} style={{padding: '8px 12px', borderRadius: '8px', border: '1px solid #f0ad4e'}}>{"<"}</button>
                           <h2 style={{ margin: 0 }}>{format(month, 'MMMM yyyy', { locale: id })}</h2>
                           <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} style={{padding: '8px 12px', borderRadius: '8px', border: '1px solid #f0ad4e'}}>{">"}</button>
                        </div>
                    ),
                }}
            />

            {/* Legenda */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                {legendItems.map(item => (
                    <div key={item.kategori} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ width: '16px', height: '16px', backgroundColor: categoryColors[item.kategori || 'Umum'], marginRight: '8px', borderRadius: '4px' }}></span>
                        <span>{item.nama_kegiatan}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}