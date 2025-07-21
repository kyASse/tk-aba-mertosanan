// app/kalender-akademik/Kalender.tsx
'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { id } from 'date-fns/locale';
import { format, isWithinInterval } from 'date-fns';
import { categoryColors } from '@/lib/constants/calendar';

type Event = {
    id: number;
    judul: string;
    tanggal: string;
    waktu?: string;
    deskripsi?: string;
    kategori: string;
    warna: string;
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

        // Gunakan tanggal tunggal (tidak ada rentang tanggal di schema baru)
        modifiers[category].push(new Date(event.tanggal));
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
        new Date(event.tanggal).getMonth() === month.getMonth() &&
        new Date(event.tanggal).getFullYear() === month.getFullYear()
    );
    // Buat daftar kategori yang unik untuk legenda
    const uniqueCategories = [...new Set(eventsInCurrentMonth.map(item => item.kategori))];

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
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>Kategori:</h4>
                {uniqueCategories.map(category => (
                    <div key={category} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ width: '16px', height: '16px', backgroundColor: categoryColors[category || 'Umum'], marginRight: '8px', borderRadius: '4px' }}></span>
                        <span>{category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}