'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

type KalenderEvent = {
  id: number;
  judul: string;
  tanggal: string;
  waktu?: string;
  deskripsi?: string;
  kategori: string;
  warna: string;
};

const bulanIndonesia = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariIndonesia = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function KalenderAkademik() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<KalenderEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from('kalender_akademik')
      .select('*')
      .gte('tanggal', startOfMonth.toISOString().split('T')[0])
      .lte('tanggal', endOfMonth.toISOString().split('T')[0])
      .order('tanggal', { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Tambahkan hari kosong untuk minggu pertama
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Tambahkan hari dalam bulan
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.tanggal === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth();
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
      {/* Kalender */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header Kalender */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {bulanIndonesia[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Header Hari */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {hariIndonesia.map(hari => (
              <div key={hari} className="p-2 text-center font-medium text-gray-600 text-sm">
                {hari}
              </div>
            ))}
          </div>

          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2 h-20"></div>;
              }

              const dayEvents = getEventsForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate?.toDateString() === day.toDateString();

              return (
                <div
                  key={day.getDate()}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 h-20 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                    isToday ? 'bg-blue-50 border-blue-300' : ''
                  } ${isSelected ? 'bg-blue-100 border-blue-400' : ''}`}
                >
                  <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs px-1 py-0.5 rounded truncate"
                        style={{ backgroundColor: event.warna + '20', color: event.warna }}
                      >
                        {event.judul}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2} lainnya</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel Detail Event */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            {selectedDate 
              ? `Kegiatan ${selectedDate.getDate()} ${bulanIndonesia[selectedDate.getMonth()]}`
              : 'Pilih Tanggal'
            }
          </h3>

          {selectedDate ? (
            selectedEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedEvents.map(event => (
                  <div key={event.id} className="border-l-4 pl-4 py-2" style={{ borderColor: event.warna }}>
                    <h4 className="font-medium text-gray-900">{event.judul}</h4>
                    {event.waktu && (
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.waktu}
                      </div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="inline-block px-2 py-1 rounded-full text-xs" 
                            style={{ backgroundColor: event.warna + '20', color: event.warna }}>
                        {event.kategori}
                      </span>
                    </div>
                    {event.deskripsi && (
                      <p className="text-sm text-gray-700 mt-2">{event.deskripsi}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Tidak ada kegiatan pada tanggal ini</p>
            )
          ) : (
            <p className="text-gray-500 text-center py-8">Klik tanggal untuk melihat detail kegiatan</p>
          )}
        </div>

        {/* Legenda Kategori */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Legenda</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
              <span className="text-sm">Kegiatan</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
              <span className="text-sm">Libur</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
              <span className="text-sm">Ujian</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-purple-500 mr-2"></div>
              <span className="text-sm">Acara Khusus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
