"use client"

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/logout-button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { use } from "react";


export default function PortalNavbar(){
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <header className={cn(
            "w-full transition-all duration-300",
            scrolled
                ? "bg-white/95 dark:bg-gray-900/45 backdrop-blur-md shadow-md py-2"
                : "bg-transparent py-4"
        )}>
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Portal TK ABA</h1>
                        <h2 className="text-2xl text-muted-foreground font-semibold">Mertosanan</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center gap-4 text-sm">
                            <Link href="/portal" className={cn("hover:underline", pathname === "/portal" && "font-semibold")}>Beranda</Link>
                            <Link href="/portal/akademik" className={cn("hover:underline", pathname?.startsWith('/portal/akademik') && "font-semibold")}>Akademik</Link>
                            <Link href="/portal/laporan" className={cn("hover:underline", pathname?.startsWith('/portal/laporan') && "font-semibold")}>Laporan</Link>
                            <Link href="/portal/pengumuman" className={cn("hover:underline", pathname?.startsWith('/portal/pengumuman') && "font-semibold")}>Pengumuman</Link>
                            <Link href="/portal/keuangan" className={cn("hover:underline", pathname?.startsWith('/portal/keuangan') && "font-semibold")}>Keuangan</Link>
                            <Link href="/portal/testimoni" className={cn("hover:underline", pathname?.startsWith('/portal/testimoni') && "font-semibold")}>Testimoni</Link>
                        </nav>
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </header>
    )
}