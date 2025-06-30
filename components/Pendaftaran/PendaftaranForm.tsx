'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { useState} from "react";
import { useEffect } from "react";
import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),
    nama_panggilan: z.string().min(1, "Nama panggilan wajib diisi"),
    jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]),
    tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
    agama: z.string().min(1, "Agama wajib diisi"),
    kewarganegaraan: z.enum(["WNI", "WNA"]),
    anak_ke: z.string().optional(),
    jumlah_saudara_kandung: z.string().optional(),
    status_anak: z.string().optional(),
    bahasa_sehari_hari: z.string().optional(),
    berat_badan: z.string().optional(),
    tinggi_badan: z.string().optional(),
    golongan_darah: z.string().optional(),
    cita_cita: z.string().optional(),
    alamat_lengkap: z.string().min(1, "Alamat wajib diisi"),
    nomor_telepon: z.string().min(1, "Nomor telepon wajib diisi"),
    jarak_tempat_tinggal: z.string().optional(),
    nama_ayah_kandung: z.string().optional(),
    pendidikan_ayah: z.string().optional(),
    pekerjaan_ayah: z.string().optional(),
    nama_ibu_kandung: z.string().optional(),
    pendidikan_ibu: z.string().optional(),
    pekerjaan_ibu: z.string().optional(),
    email: z.string().email("Email tidak valid"),
    wali_nama: z.string().optional(),
    wali_pendidikan: z.string().optional(),
    wali_hubungan: z.string().optional(),
    wali_pekerjaan: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function PendaftaranForm() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama_lengkap: "",
            nama_panggilan: "",
            jenis_kelamin: undefined,
            tempat_lahir: "",
            tanggal_lahir: "",
            agama: "",
            kewarganegaraan: undefined,
            anak_ke: "",
            jumlah_saudara_kandung: "",
            status_anak: "",
            bahasa_sehari_hari: "",
            berat_badan: "",
            tinggi_badan: "",
            golongan_darah: "",
            cita_cita: "",
            alamat_lengkap: "",
            nomor_telepon: "",
            jarak_tempat_tinggal: "",
            nama_ayah_kandung: "",
            pendidikan_ayah: "",
            pekerjaan_ayah: "",
            nama_ibu_kandung: "",
            pendidikan_ibu: "",
            pekerjaan_ibu: "",
            email: "",
            wali_nama: "",
            wali_pendidikan: "",
            wali_hubungan: "",
            wali_pekerjaan: "",
        },
    });

    useEffect(() => {
        if (isSuccess) {
            toast("Pendaftaran Berhasil", {
                description: (
                    <div>
                        <p className="text-muted-foreground">
                            Terima kasih. Langkah selanjutnya, silakan konfirmasi pendaftaran ke nomor WhatsApp sekolah di <strong>0812-3456-7890</strong> (ganti nomor) dengan format:
                        </p>
                        <pre className="text-muted-foreground p-4 rounded mt-2 border border-muted-200 whitespace-pre-wrap break-words">
                            KONFIRMASI PENDAFTARAN - {form.getValues("nama_lengkap")}
                        </pre>
                    </div>
                ),
                duration: 30000,
                onAutoClose: () => {
                    window.location.href = "/";
                },
                
            })
        }
    }, [isSuccess, form])

    async function onSubmit(values: FormSchema) {
        setError(null);
        try {
            const dataToSubmit = {
                ...values,
                anak_ke: values.anak_ke === "" || values.anak_ke === undefined ? null : parseInt(values.anak_ke ?? ""),
                jumlah_saudara_kandung: values.jumlah_saudara_kandung === "" || values.jumlah_saudara_kandung === undefined ? null : parseInt(values.jumlah_saudara_kandung ?? ""),
                berat_badan: values.berat_badan === "" || values.berat_badan === undefined ? null : parseInt(values.berat_badan ?? ""),
                tinggi_badan: values.tinggi_badan === "" || values.tinggi_badan === undefined ? null : parseInt(values.tinggi_badan ?? ""),
                jalur_pendaftaran: "Online",
            };
            const { error: insertError } = await supabase.from("pendaftar").insert([dataToSubmit]);
            if (insertError) throw insertError;
            setIsSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                toast.error("Gagal mengirim pendaftaran", {
                    description: err.message
                })
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={(event) => form.handleSubmit(onSubmit)(event)} className="flex flex-col gap-8">
                <fieldset className="flex flex-col gap-4 border border-gray-200 rounded-lg p-6">
                    <legend className="font-bold text-lg px-2 text-gray-700">A. Keterangan Anak</legend>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="nama_lengkap"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>1. Nama Lengkap</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nama_panggilan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>2. Nama Panggilan</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="jenis_kelamin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>3. Jenis Kelamin</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            name={field.name}
                                            disabled={field.disabled}
                                        >
                                            <SelectTrigger className="select select-bordered w-full">
                                                <SelectValue placeholder="Pilih jenis kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="tempat_lahir"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>4. Tempat Lahir</FormLabel>
                                        <FormControl>
                                            <Input type="text" className="input input-bordered w-full" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tanggal_lahir"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Tanggal Lahir</FormLabel>
                                        <FormControl>
                                            <Input type="date" className="input input-bordered w-full" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="agama"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>5. Agama</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kewarganegaraan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>6. Kewarganegaraan</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            name={field.name}
                                            disabled={field.disabled}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kewarganegaraan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="WNI">WNI</SelectItem>
                                                <SelectItem value="WNA">WNA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="anak_ke"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>7. Anak ke</FormLabel>
                                    <FormControl>
                                        <Input type="number" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="jumlah_saudara_kandung"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>8. Jumlah saudara kandung</FormLabel>
                                    <FormControl>
                                        <Input type="number" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status_anak"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>9. Status Anak</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" placeholder="Contoh: Anak Kandung" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bahasa_sehari_hari"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>10. Bahasa sehari-hari</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="berat_badan"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>11. Berat Badan (Kg)</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="input input-bordered w-full" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tinggi_badan"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Tinggi Badan (Cm)</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="input input-bordered w-full" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="golongan_darah"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>12. Golongan Darah</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            name={field.name}
                                            disabled={field.disabled}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih golongan darah" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pilih">-- Pilih --</SelectItem>
                                                <SelectItem value="A">A</SelectItem>
                                                <SelectItem value="B">B</SelectItem>
                                                <SelectItem value="AB">AB</SelectItem>
                                                <SelectItem value="O">O</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cita_cita"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>14. Cita-cita</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="alamat_lengkap"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>15. Alamat Tempat Tinggal</FormLabel>
                                    <FormControl>
                                        <Textarea className="textarea textarea-bordered w-full" rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nomor_telepon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>16. Nomor Telepon/HP</FormLabel>
                                    <FormControl>
                                        <Input type="tel" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="jarak_tempat_tinggal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>17. Jarak tempat tinggal</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" placeholder="Contoh: ± 1 Km" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-6">
                    <legend className="font-bold text-lg px-2 text-gray-700">B. Orang Tua</legend>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="nama_ayah_kandung"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Ayah Kandung</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nama_ibu_kandung"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Ibu Kandung</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pendidikan_ayah"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pendidikan Ayah</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pendidikan_ibu"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pendidikan Ibu</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pekerjaan_ayah"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pekerjaan Ayah</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pekerjaan_ibu"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pekerjaan Ibu</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat Email (untuk Portal Orang Tua)</FormLabel>
                                    <FormControl>
                                        <Input type="email" className="input input-bordered w-full" placeholder="contoh@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-6">
                    <legend className="font-bold text-lg px-2 text-gray-700">C. Wali Anak (diisi jika tinggal bersama wali)</legend>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="wali_nama"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Wali</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="wali_pendidikan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pendidikan Tertinggi Wali</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="wali_hubungan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hubungan dengan Wali</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="wali_pekerjaan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pekerjaan Wali</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="input input-bordered w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </fieldset>

                {error && <p className="text-destructive mt-2">{error}</p>}

                <Button type="submit" className="w-full mt-4" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Mengirim..." : "Daftar Sekarang"}
                </Button>
            </form>
        </Form>
    );
}