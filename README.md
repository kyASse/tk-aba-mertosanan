# TK ABA Mertosanan - Website Resmi

Website resmi TK ABA Mertosanan yang dibangun dengan Next.js 14, TypeScript, dan Supabase.

## Fitur Utama

- **Halaman Beranda**: Menampilkan informasi umum sekolah, galeri, dan testimonial
- **Program Pendidikan**: Detail program kelas dan kegiatan ekstrakurikuler
- **Berita**: Artikel dan pengumuman sekolah
- **Galeri**: Foto-foto kegiatan sekolah
- **Kalender Akademik**: Jadwal kegiatan sekolah sepanjang tahun
- **Pendaftaran Online**: Formulir pendaftaran siswa baru
- **Portal Admin**: Dashboard untuk mengelola konten website
- **Autentikasi**: Sistem login untuk admin dan pengguna

## Teknologi yang Digunakan

- **Frontend**: Next.js 14 dengan App Router, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage untuk gambar dan file
- **Deployment**: Vercel

## Struktur Proyek

```
app/
├── admin/          # Dashboard admin
├── auth/           # Halaman autentikasi
├── berita/         # Halaman berita
├── galeri/         # Galeri foto
├── pendaftaran/    # Formulir pendaftaran
├── program/        # Program pendidikan
└── ...

components/
├── admin/          # Komponen admin
├── home/           # Komponen beranda
├── shared/         # Komponen bersama
└── ui/             # Komponen UI dasar
```

## Instalasi dan Menjalankan Proyek

1. Clone repository:
```bash
git clone [repository-url]
cd tk-aba-mertosanan
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
Buat file `.env.local` dan isi dengan konfigurasi Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Jalankan development server:
```bash
npm run dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser

## Deployment

Project ini siap untuk dideploy ke Vercel:

1. Push ke GitHub repository
2. Connect ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy

## Kontribusi

Untuk melakukan perubahan atau perbaikan:

1. Fork repository
2. Buat branch baru untuk fitur/perbaikan
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## Kontak

TK ABA Mertosanan  
Website: [URL Website]  
Email: [Email Kontak]  
Alamat: [Alamat Lengkap]

---

© 2024 TK ABA Mertosanan. All rights reserved.
