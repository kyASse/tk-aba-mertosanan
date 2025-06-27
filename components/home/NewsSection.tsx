"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, Calendar } from "lucide-react";

// import { createClient } from '@/lib/supabase/server';

// async function fetchNewsData() {
//     const supabase = await createClient();
//     const { data, error } = await supabase
//         .from('berita')
//         .select('judul, ringkasan, isi, image_url, tanggal_terbit, penulis_id, created_at');

//     if (error) {
//         console.error('Error fetching news data:', error);
//         return [];
//     }

//     return data;
// }

const news = [
    {
        id: 1,
        title: "Prestasi Membanggakan di Lomba Mewarnai Tingkat Kabupaten",
        date: "15 Maret 2024",
        excerpt: "Siswa TK ABA Mertosanan berhasil meraih juara 1 dalam lomba mewarnai tingkat kabupaten yang diselenggarakan...",
        image: "https://images.pexels.com/photos/8613317/pexels-photo-8613317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 2,
        title: "Program Parenting: Membangun Karakter Anak di Era Digital",
        date: "10 Maret 2024",
        excerpt: "TK ABA Mertosanan mengadakan seminar parenting dengan menghadirkan psikolog anak untuk membahas...",
        image: "https://images.pexels.com/photos/8535227/pexels-photo-8535227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 3,
        title: "Kunjungan Edukatif ke Museum Pendidikan Indonesia",
        date: "5 Maret 2024",
        excerpt: "Dalam rangka mengenalkan sejarah pendidikan, siswa TK B melakukan kunjungan edukatif ke Museum...",
        image: "https://images.pexels.com/photos/8535188/pexels-photo-8535188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
];

export default function NewsSection() {
    // const newsData = await fetchNewsData();

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Berita Terkini</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Informasi terbaru seputar kegiatan dan prestasi TK ABA Mertosanan
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover "
                                />  
                            </div>
                            <div className="p-6">
                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{item.date}</span>
                                </div>
                                <Link href="#" className="text-xl font-bold mb-2">{item.title}</Link>
                                <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                                <Link href="#" className="text-accent-foreground hover:underline inline-flex items-center">
                                        Baca Selengkapnya <ChevronRight className="ml-2" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}