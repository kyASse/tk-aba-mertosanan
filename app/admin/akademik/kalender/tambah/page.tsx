'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const kategoriOptions = [
  { value: 'Kegiatan', label: 'Kegiatan', color: '#3b82f6' },
  { value: 'Libur', label: 'Libur', color: '#ef4444' },
  { value: 'Ujian', label: 'Ujian', color: '#eab308' },
  { value: 'Acara Khusus', label: 'Acara Khusus', color: '#a855f7' },
];

export default function TambahEventPage() {
  const [form, setForm] = useState({
    judul: '',
    tanggal: '',
    waktu: '',
    deskripsi: '',
    kategori: 'Kegiatan',
    warna: '#3b82f6',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'kategori') {
      const selectedKategori = kategoriOptions.find(k => k.value === value);
      setForm({ 
        ...form, 
        kategori: value,
        warna: selectedKategori?.color || '#3b82f6'
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('kalender_akademik')
      .insert([{
        judul: form.judul,
        tanggal: form.tanggal,
        waktu: form.waktu || null,
        deskripsi: form.deskripsi || null,
        kategori: form.kategori,
        warna: form.warna,
      }]);

    setLoading(false);

    if (error) {
      alert('Gagal menyimpan event: ' + error.message);
    } else {
      router.push('/admin/akademik/kalender');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tambah Event Kalender</h1>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          ← Kembali
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Judul Event</label>
            <input
              type="text"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Waktu (Opsional)</label>
              <input
                type="time"
                name="waktu"
                value={form.waktu}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Kategori</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              {kategoriOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Warna</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="warna"
                value={form.warna}
                onChange={handleChange}
                className="w-12 h-10 border rounded"
              />
              <span className="text-sm text-gray-600">{form.warna}</span>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Deskripsi (Opsional)</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Deskripsi detail tentang event..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Simpan Event'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded font-semibold transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
