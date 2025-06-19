// app/portal/layout.tsx
import LogoutButton from "@/components/logout-button"; // Sesuaikan path jika perlu
import { createClient } from "@/lib/supabase/server";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                <div>
                    <h2>Portal Orang Tua TK ABA Mertosanan</h2>
                    <p>Selamat Datang, {user?.email}</p>
                </div>
                {/* Orang tua BISA mengakses halaman publik dari sini */}
                <nav>
                    <a href="/" style={{ marginRight: '1rem' }}>Beranda</a>
                    <a href="/galeri" style={{ marginRight: '1rem' }}>Galeri</a>
                    <a href="/kontak" style={{ marginRight: '1rem' }}>Kontak</a>
                </nav>
                <LogoutButton />
            </header>

            <main style={{ padding: '2rem' }}>
                {children}
            </main>

            <footer style={{ textAlign: 'center', padding: '1rem', marginTop: '2rem', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
                <p>© 2025 TK ABA Mertosanan</p>
            </footer>
        </div>
    );
}