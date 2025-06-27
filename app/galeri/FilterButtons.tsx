// app/galeri/FilterButtons.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Props = {
    kategoriList: { kategori: string }[];
};

export default function FilterButtons({ kategoriList }: Props) {
    const searchParams = useSearchParams();
    const currentKategori = searchParams.get('kategori');

    return (
        <div>
            <Link href="/galeri">
                <button style={{ backgroundColor: !currentKategori ? 'pink' : '#eee' }}>
                    Semua Foto
                </button>
            </Link>
            {kategoriList.map(item => (
                <Link href={`/galeri?kategori=${encodeURIComponent(item.kategori)}`} key={item.kategori}>
                    <button style={{ backgroundColor: currentKategori === item.kategori ? 'pink' : '#eee' }}>
                        {item.kategori}
                    </button>
                </Link>
            ))}
        </div>
    );
}