import Image from "next/image";
import Link from "next/image";
// import { Button } from "@/components/ui/button";
import {
    Phone,
    ChevronRight,
    Clock,
    Award,
    BookOpen,
    Heart,
    Users,
    Calendar
} from "lucide-react";
import ValueCard from "@/components/tentang-kami/ValueCard";
// import StaffCard from "@/components/StaffCard";
import PageHeader from "@/components/shared/PageHeader";
import SchoolIdentity from "@/components/tentang-kami/SchoolIdentity";
import Achievements from "@/components/tentang-kami/Achievements";

export default function AboutUs() {
    return (
        <div className="min-h-screen">
            <PageHeader 
                title="Tentang Kami"
                description="Mengenal lebih dekat TK ABA Mertosanan"
                background="bg-primary/20"
            />

            {/* Visi Misi */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Visi & Misi</h2>
                            
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-2 flex items-center">
                                    <Award className="w-5 h-5 mr-2 text-primary"/> Visi
                                </h3>
                                <p className="text-muted-foreground">
                                    Mewujudkan generasi Muslim yang cerdas, ceria, kreatif, mandiri dan bberakhlak mulia.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 flex items-center">
                                    <Award className="w-5 h-5 mr-2 text-primary"/> Misi
                                </h3>
                                <ul className="list-disc text-muted-foreground space-y-2 pl-6">
                                    <li>Menanamkan dasar-dasar nilai keimanan dan ketaqwaan</li>
                                    <li>Menciptakan lingkungan belajar yang menyenangkan dan ramah anak</li>
                                    <li>Menumbuhkan kreativitas dan kemampuan berpikir anak</li>
                                    <li>Membangun kemandirian dan rasa percaya diri sejak dini</li>
                                    <li>Menanamkan akhlakul karimah dalam kehidupan sehari-hari</li>
                                </ul>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-secondary rounded-full -z-10"></div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full -z-10"></div>
                            <Image 
                                src={"https://images.pexels.com/photos/8535220/pexels-photo-8535220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                                alt="Anak-anak belajar di TK ABA Mertosanan"
                                width={600}
                                height={600}
                                className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Identitas TK */}
            <SchoolIdentity />

            {/* Nilai-Nilai */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Nilai-Nilai Kami</h2>
                    <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                        Kami Menawarkan nilai-nilai islami sejak dini untuk membentuk karakter anak yang berakhlak mulia.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ValueCard 
                            title="Iman dan Taqwa"
                            description="Menanamkan dasar-dasar nilai keimanan dan ketaqwaan dalam kehidupan sehari-hari."
                            icon="book"
                            color="primary"
                        />
                        <ValueCard 
                            title="Akhlakul Karimah"
                            description="Menanamkan akhlakul karimah dalam kehidupan sehari-hari."
                            icon="heart"
                            color="highlight"
                        />
                        <ValueCard 
                            title="Kreativitas"
                            description="Menumbuhkan kreativitas dan kemampuan berpikir anak."
                            icon="brain"
                            color="secondary"
                        />
                        <ValueCard 
                            title="Kemandirian"
                            description="Membangun kemandirian dan rasa percaya diri sejak dini."
                            icon="users"
                            color="accent"
                        />
                    </div>
                </div>
            </section>

            {/* Prestasi */}
            <Achievements />

            
        </div>
    );
}
