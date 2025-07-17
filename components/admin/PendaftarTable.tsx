"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import PendaftarSearch from "./PendaftarSearch";

type Pendaftar = {
    id: string;
    nama_lengkap: string | null;
    nama_ayah_kandung: string | null;
    nama_ibu_kandung?: string | null;
    jenis_kelamin: string | null;
    tanggal_lahir: string | null;
    status_pendaftaran: string | null;
    created_at: string;
};

interface PendaftarTableProps {
    pendaftar: Pendaftar[];
}

export default function PendaftarTable({ pendaftar }: PendaftarTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

  // Filter data berdasarkan search query
    const filteredPendaftar = useMemo(() => {
        if (!searchQuery) return pendaftar;
    
        return pendaftar.filter((item) => {
        const nama = item.nama_lengkap?.toLowerCase() || '';
        const ayah = item.nama_ayah_kandung?.toLowerCase() || '';
        const ibu = item.nama_ibu_kandung?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        
        return nama.includes(query) || ayah.includes(query) || ibu.includes(query);
        });
    }, [pendaftar, searchQuery]);

  // Helper function untuk status badge
    const getStatusBadge = (status: string | null) => {
        switch (status) {
        case 'diterima':
            return <Badge className="bg-green-100 text-green-800 border-green-300">Diterima</Badge>;
        case 'menunggu_persetujuan':
            return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Menunggu Persetujuan</Badge>;
        case 'validasi_ulang':
            return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Validasi Ulang</Badge>;
        case 'ditolak':
            return <Badge className="bg-red-100 text-red-800 border-red-300">Ditolak</Badge>;
        default:
            return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Belum Divalidasi</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <PendaftarSearch 
                onSearch={setSearchQuery}
                placeholder="Cari nama siswa atau ID registrasi"
            />

            {/* Daftar Siswa Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Siswa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Id</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Nama Anak</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Nama Orang Tua</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Jenis Kelamin</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Tanggal Daftar</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Status Pendaftaran</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPendaftar && filteredPendaftar.length > 0 ? (
                                    filteredPendaftar.map((item: Pendaftar, index: number) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">TK25-{String(index + 1).padStart(2, '0')}</td>
                                            <td className="py-3 px-4 font-medium">{item.nama_lengkap || 'Nama tidak tersedia'}</td>
                                            <td className="py-3 px-4">
                                                {item.nama_ayah_kandung || 'Tidak tersedia'} / {item.nama_ibu_kandung || 'Tidak tersedia'}
                                            </td>
                                            <td className="py-3 px-4">
                                                {item.jenis_kelamin === 'L' ? 'Laki-laki' : 
                                                item.jenis_kelamin === 'P' ? 'Perempuan' : 
                                                item.jenis_kelamin || 'Tidak tersedia'}
                                            </td>
                                            <td className="py-3 px-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="py-3 px-4">
                                                {getStatusBadge(item.status_pendaftaran)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Link href={`/admin/pendaftar/detail/${item.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Lihat Detail
                                                </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                        {searchQuery ? 'Tidak ada hasil yang ditemukan.' : 'Belum ada pendaftar baru.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
