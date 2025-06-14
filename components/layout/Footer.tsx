import Link from "next/link";
import {
    School, Phone, Mail, MapPin,
    Facebook, Instagram, Youtube,
    Clock, Calender, BookOpen
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary/40 pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-primary p-2 rounded-full">
                                <School className="text-primary-foreground w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">TK ABA Mertosanan</h3>
                                <p className="text-sm">Pendidikan Anak Islami</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            Mewujudkan generasi Muslim yang cerdas, ceria, kreatif, mandiri dan bberakhlak mulia.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2" />
                            Halaman
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="hover:text-primary transition-colors">
                                Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/tentang" className="hover:text-primary transition-colors">
                                Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/program" className="hover:text-primary transition-colors">
                                Program & kurikulum
                                </Link>
                            </li>
                            <li>
                                <Link href="/galeri" className="hover:text-primary transition-colors">
                                Galeri
                                </Link>
                            </li>
                            <li>
                                <Link href="/pendaftaran" className="hover:text-primary transition-colors">
                                Pendaftaran
                                </Link>
                            </li>
                            <li>
                                <Link href="/kontak" className="hover:text-primary transition-colors">
                                Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <Phone className="w-5 h-5 mr-2" />
                            Kontak
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-attention" />
                                <span>Jl. Mertosanan, Potonoro, Banguntapan, Bantul, DIY</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-primary" />
                                <span>+62 xxx-xxxx-xxxx</span>
                            </li >
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 mr-2 text-accent" />
                                <span>example@mail.sch.id</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            Jam Sekolah
                        </h3>
                        <ul className="space-y-3">
                            <li className="w-5 h-5 mr-2 mt-0.5 text-secondary-foreground">
                                <div>
                                    <p className="font-medium">Senin - Jumat</p>
                                    <p className="text-muted-foreground">07:30 -  11:00 WIB</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Calender className />
                                <div>
                                    <p></p>
                                    <p></p>
                                </div>
                            </li>
                        </ul>

                        <div>
                            <h4>
                                
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}