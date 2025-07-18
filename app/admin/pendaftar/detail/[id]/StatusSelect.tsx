'use client';

import { useTransition } from "react";
import { updateStatusPendaftaran } from "../../actions";

export default function StatusSelect({ id, value }: { id: string, value: string | null }) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        startTransition(async () => {
            await updateStatusPendaftaran(id, newStatus);
        });
    };

    return (
        <select
            value={value || ""}
            onChange={handleChange}
            disabled={isPending}
            className="px-2 py-1 rounded border text-xs font-semibold"
            style={{
                background:
                    value === "Akun Dibuat"
                        ? "#d1fae5"
                        : value === "Diterima"
                        ? "#dbeafe"
                        : value === "Ditolak"
                        ? "#fee2e2"
                        : value === "Revisi"
                        ? "#fef9c3"
                        : "#f3f4f6",
                color:
                    value === "Akun Dibuat"
                        ? "#047857"
                        : value === "Diterima"
                        ? "#1d4ed8"
                        : value === "Ditolak"
                        ? "#b91c1c"
                        : value === "Revisi"
                        ? "#b45309"
                        : "#374151",
            }}
        >
            <option value="Akun Dibuat">Akun Dibuat</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
            <option value="Revisi">Revisi</option>
        </select>
    );
}