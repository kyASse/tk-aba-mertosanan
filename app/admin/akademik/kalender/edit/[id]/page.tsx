import { redirect } from "next/navigation";

export default function EditKegiatanAkademikRedirect({ params }: { params: { id: string } }) {
	const { id } = params || {};
	redirect(`/admin/kalender/edit/${id}`);
}

