import { redirect } from "next/navigation";

export default async function EditKegiatanAkademikRedirect({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	redirect(`/admin/kalender/edit/${id}`);
}

