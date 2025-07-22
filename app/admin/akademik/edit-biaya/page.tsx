import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateBiayaAction, updateCatatanSppAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

export default async function EditBiayaPage() {
    const supabase = await createClient();
    const biayaPromise = supabase.from('biaya_pendaftaran').select('*').order('id');
    const sppPromise = supabase.from('konten_halaman').select('isi').eq('slug', 'catatan-spp').single();

    const [{ data: biaya }, { data: catatanSpp }] = await Promise.all([biayaPromise, sppPromise]);
    
    if (!biaya) return redirect('/admin/akademik');

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Edit Rincian Keuangan</h1>
                <Button variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-medium flex items-center gap-2 rounded-full px-4 py-2">
                    <Plus size={18} />
                    Tambah Komponen Biaya
                </Button>
            </div>
            <div className="mb-4">
                <Link href="/admin/akademik" className="text-blue-600 hover:underline text-sm">&larr; Kembali</Link>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-x-auto bg-white shadow-sm">
                <form action={updateBiayaAction}>
                    <h3 className="font-semibold text-lg px-4 pt-4 pb-2">Tabel Biaya Utama</h3>
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 font-semibold">
                                <th className="px-4 py-3 text-left border-b">No</th>
                                <th className="px-4 py-3 text-left border-b">Komponen Biaya</th>
                                <th className="px-4 py-3 text-left border-b">PUTRA (Rp)</th>
                                <th className="px-4 py-3 text-left border-b">PUTRI (Rp)</th>
                                <th className="px-4 py-3 text-center border-b">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {biaya.map((item, index) => (
                                <tr key={item.id} className="even:bg-gray-50">
                                    <td className="px-4 py-2 border-b">{index + 1}.</td>
                                    <td className="px-4 py-2 border-b">
                                        {item.komponen_biaya}
                                        <input type="hidden" name={`biaya[${index}][id]`} value={item.id} />
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <input
                                            type="number"
                                            name={`biaya[${index}][putra]`}
                                            defaultValue={item.biaya_putra || 0}
                                            className="w-28 rounded border-gray-300 px-2 py-1 text-right"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <input
                                            type="number"
                                            name={`biaya[${index}][putri]`}
                                            defaultValue={item.biaya_putri || 0}
                                            className="w-28 rounded border-gray-300 px-2 py-1 text-right"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-b text-center">
                                        <div className="flex gap-2 justify-center">
                                            <Button type="button" size="icon" variant="outline" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700">
                                                <Pencil size={16} />
                                            </Button>
                                            <Button type="button" size="icon" variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mt-4 px-4 pb-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-6 py-2">
                            Simpan Perubahan Tabel Biaya
                        </Button>
                    </div>
                </form>
            </div>

            <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                <form action={updateCatatanSppAction}>
                    <h3 className="font-semibold mb-2">Catatan Tambahan (SPP)</h3>
                    <label htmlFor="catatan-spp" className="block text-sm mb-1">Teks Catatan</label>
                    <input
                        id="catatan-spp"
                        name="catatan-spp"
                        type="text"
                        defaultValue={typeof catatanSpp?.isi === "string" ? catatanSpp.isi : ""}
                        className="w-full rounded border-gray-300 px-3 py-2 mb-3"
                    />
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-6 py-2">
                            Simpan Catatan SPP
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}