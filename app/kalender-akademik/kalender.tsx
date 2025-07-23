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
    tanggal_berakhir?: string;
    waktu?: string;
    deskripsi?: string;
    kategori: string;
    warna: string;
};

export default function Kalender({ events }: { events: Event[] }) {
    const [month, setMonth] = useState<Date>(new Date());

    // Helper function untuk format range tanggal
    const formatEventDate = (event: Event) => {
        const startDate = new Date(event.tanggal);
        if (event.tanggal_berakhir && event.tanggal_berakhir !== event.tanggal) {
            const endDate = new Date(event.tanggal_berakhir);
            return `${format(startDate, 'dd MMM', { locale: id })} - ${format(endDate, 'dd MMM yyyy', { locale: id })}`;
        } else {
            return format(startDate, 'dd MMM yyyy', { locale: id });
        }
    };

    // Buat objek modifiers dinamis dari data event
    const modifiers: any = {};
    events.forEach(event => {
        const category = event.kategori || 'Umum';
        // Pastikan setiap kategori punya modifier sendiri
        if (!modifiers[category]) {
            modifiers[category] = [];
        }

        // Cek apakah event ini memiliki range tanggal atau hanya satu hari
        if (event.tanggal_berakhir && event.tanggal_berakhir !== event.tanggal) {
            // Event dengan range tanggal - tambahkan semua tanggal dalam range
            const startDate = new Date(event.tanggal);
            const endDate = new Date(event.tanggal_berakhir);
            
            // Generate semua tanggal dalam range
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                modifiers[category].push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else {
            // Event satu hari saja
            modifiers[category].push(new Date(event.tanggal));
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

            {/* Legenda dengan Detail Event */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
                    Event di {format(month, 'MMMM yyyy', { locale: id })}:
                </h4>
                {eventsInCurrentMonth.length > 0 ? (
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {eventsInCurrentMonth.map(event => (
                            <div key={event.id} style={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                marginBottom: '12px',
                                padding: '8px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                                borderLeft: `4px solid ${categoryColors[event.kategori || 'Umum']}`
                            }}>
                                <span style={{ 
                                    width: '16px', 
                                    height: '16px', 
                                    backgroundColor: categoryColors[event.kategori || 'Umum'], 
                                    marginRight: '8px', 
                                    borderRadius: '4px',
                                    flexShrink: 0,
                                    marginTop: '2px'
                                }}></span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' }}>
                                        {event.judul}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                                        📅 {formatEventDate(event)}
                                        {event.waktu && ` • 🕐 ${event.waktu}`}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>
                                        📂 {event.kategori}
                                    </div>
                                    {event.deskripsi && (
                                        <div style={{ fontSize: '12px', color: '#555', marginTop: '4px', fontStyle: 'italic' }}>
                                            {event.deskripsi}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ color: '#888', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
                        Tidak ada event di bulan ini
                    </div>
                )}
                
                {/* Kategori Legend */}
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Kategori:</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {uniqueCategories.map(category => (
                            <div key={category} style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                fontSize: '11px',
                                padding: '4px 8px',
                                backgroundColor: categoryColors[category || 'Umum'] + '20',
                                borderRadius: '12px',
                                border: `1px solid ${categoryColors[category || 'Umum']}`
                            }}>
                                <span style={{ 
                                    width: '8px', 
                                    height: '8px', 
                                    backgroundColor: categoryColors[category || 'Umum'], 
                                    marginRight: '6px', 
                                    borderRadius: '50%' 
                                }}></span>
                                <span>{category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}