'use client';

import { useState, useTransition } from 'react';
import { deleteGaleriAction } from './actions';

type Props = {
    galeriId: number;
    imageUrl: string;
};

export default function DeleteImageButton({ galeriId, imageUrl }: Props) {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        startTransition(async () => {
            const result = await deleteGaleriAction(galeriId, imageUrl);
            if (!result.success) alert(result.message);
        });
    };

    return (
        <>
            <button
                onClick={handleDelete}
                disabled={isPending}
                style={{
                    background: "linear-gradient(90deg, #ff5858 0%, #ff7e5f 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 18px",
                    fontWeight: 600,
                    cursor: isPending ? "not-allowed" : "pointer",
                    opacity: isPending ? 0.7 : 1,
                    boxShadow: "0 2px 8px 0 rgba(255, 87, 34, 0.08)",
                    transition: "background 0.2s, box-shadow 0.2s",
                    marginLeft: 8,
                }}
                onMouseOver={e => (e.currentTarget.style.background = "#ff1744")}
                onMouseOut={e => (e.currentTarget.style.background = "linear-gradient(90deg, #ff5858 0%, #ff7e5f 100%)")}
            >
                {isPending ? "Menghapus..." : "🗑️ Hapus"}
            </button>
            {showConfirm && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 200,
                }}>
                    <div style={{
                        background: "#fff",
                        padding: 28,
                        borderRadius: 12,
                        minWidth: 320,
                        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
                        textAlign: "center",
                        position: "relative"
                    }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                            Hapus Gambar?
                        </div>
                        <div style={{ color: "#555", marginBottom: 18 }}>
                            Apakah Anda yakin ingin menghapus gambar ini dari galeri?<br />
                            Tindakan ini tidak dapat dibatalkan.
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                style={{
                                    background: "#eee",
                                    color: "#333",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "8px 18px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                style={{
                                    background: "linear-gradient(90deg, #ff5858 0%, #ff7e5f 100%)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "8px 18px",
                                    fontWeight: 600,
                                    cursor: isPending ? "not-allowed" : "pointer",
                                    opacity: isPending ? 0.7 : 1,
                                }}
                            >
                                {isPending ? "Menghapus..." : "Ya, Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}