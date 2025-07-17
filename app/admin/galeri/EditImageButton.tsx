'use client';

import { useState } from "react";
import Image from "next/image";
import { updateGaleriAction } from "./actions";

type Props = {
    galeriId: number;
    imageUrl: string;
    keterangan: string | null;
    kategori: string | null;
    onUpdated?: () => void;
};

const kategoriPilihan = [
    "Kegiatan Belajar",
    "Bermain",
    "Seni & Kreativitas",
    "Ibadah",
    "Acara Khusus"
];

export default function EditImageButton({ galeriId, imageUrl, keterangan, kategori, onUpdated }: Props) {
    const [open, setOpen] = useState(false);
    const [newKeterangan, setNewKeterangan] = useState(keterangan || "");
    const [newKategori, setNewKategori] = useState(kategori || "");
    const [newImage, setNewImage] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = await updateGaleriAction(galeriId, {
            keterangan: newKeterangan,
            kategori: newKategori,
            image: newImage,
        });

        setIsSaving(false);
        if (result.success) {
            setOpen(false);
            if (onUpdated) onUpdated();
        } else {
            alert(result.message || "Gagal update galeri");
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                style={{
                    background: "linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)",
                    color: "#333",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 20px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px 0 rgba(255, 193, 7, 0.10)",
                    marginRight: 8,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 16,
                    transition: "background 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={e => (e.currentTarget.style.background = "#ffe082")}
                onMouseOut={e => (e.currentTarget.style.background = "linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)")}
            >
                <span style={{ fontSize: 18 }}>✏️</span> Edit
            </button>
            {open && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 100,
                }}>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: "#fff",
                            padding: 32,
                            borderRadius: 14,
                            minWidth: 340,
                            maxWidth: 400,
                            width: "100%",
                            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            gap: 18,
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            style={{
                                position: "absolute",
                                top: 12,
                                right: 16,
                                background: "none",
                                border: "none",
                                fontSize: 22,
                                color: "#888",
                                cursor: "pointer",
                                fontWeight: 700,
                            }}
                            aria-label="Tutup"
                        >×</button>
                        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, textAlign: "center" }}>Edit Gambar</h2>
                        <div style={{ margin: "0 auto 10px auto" }}>
                            <Image src={imageUrl} alt="Preview" width={200} height={200} style={{ objectFit: "cover", borderRadius: 10, boxShadow: "0 2px 8px #eee" }} />
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>Ganti Gambar (opsional):</label>
                            <input type="file" accept="image/*" onChange={e => setNewImage(e.target.files?.[0] || null)} />
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>Judul/Keterangan:</label>
                            <input
                                type="text"
                                value={newKeterangan}
                                onChange={e => setNewKeterangan(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 10px",
                                    borderRadius: 6,
                                    border: "1px solid #ddd",
                                    fontSize: 15,
                                }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>Kategori:</label>
                            <select
                                value={newKategori}
                                onChange={e => setNewKategori(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 10px",
                                    borderRadius: 6,
                                    border: "1px solid #ddd",
                                    fontSize: 15,
                                }}
                                required
                            >
                                <option value="" disabled>Pilih kategori</option>
                                {kategoriPilihan.map(kat => (
                                    <option key={kat} value={kat}>{kat}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving}
                            style={{
                                marginTop: 10,
                                background: "linear-gradient(90deg, #007bff 0%, #00c6ff 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 0",
                                fontWeight: 700,
                                fontSize: 16,
                                cursor: isSaving ? "not-allowed" : "pointer",
                                boxShadow: "0 2px 8px 0 rgba(0,123,255,0.08)",
                                width: "100%",
                                transition: "background 0.2s, box-shadow 0.2s",
                                opacity: isSaving ? 0.7 : 1,
                            }}
                        >
                            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}