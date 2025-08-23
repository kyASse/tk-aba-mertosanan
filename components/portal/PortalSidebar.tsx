"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarDays, FileText, Megaphone, HandCoins, MessageSquareQuote, Home } from "lucide-react";

const links = [
  { href: "/portal", label: "Beranda", icon: Home },
  { href: "/portal/akademik", label: "Akademik", icon: CalendarDays },
  { href: "/portal/laporan", label: "Laporan", icon: FileText },
  { href: "/portal/pengumuman", label: "Pengumuman", icon: Megaphone },
  { href: "/portal/keuangan", label: "Keuangan", icon: HandCoins },
  { href: "/portal/testimoni", label: "Testimoni", icon: MessageSquareQuote },
];

export default function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 shrink-0 border-r bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
