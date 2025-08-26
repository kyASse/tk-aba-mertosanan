import { redirect } from "next/navigation";

export default function EditKegiatanAkademikRedirect({ params }: any) {
	const { id } = params || {};
	redirect(`/admin/kalender/edit/${id}`);
}

