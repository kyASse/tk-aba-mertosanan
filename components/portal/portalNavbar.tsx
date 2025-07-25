"use client"

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/logout-button";
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
                    <LogoutButton />
                </div>
            </div>
        </header>
    )
}