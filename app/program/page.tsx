import Image from "next/image";
import PageHeader from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, Calendar } from "lucide-react";

export default function Program() {
    return (
        <div className="min-h-screen">
            <PageHeader 
                title="Program & Pendidikan"
                description="Mengenal program pendidikan di TK ABA Mertosanan"
                background="bg-accent/20"
            />

            {/* Ikhtisar Program */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6"> Program Pendidikan</h2>
                            <p className="text-muted-foreground mb-6">
                                TK ABA Mertosanan menyediakan program pendidikan yang komprehensif untuk mendukung perkembangan anak secara holistik.
                                Kurikulum kami dirancang untuk mengembangkan aspek kognitif, afektif, dan psikomotorik anak dengan pendekatan yang menyenangkan.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="mt-1 bg-accent/20 p-2 rounded-full">
                                        <BookOpen className="h-5 w-5 text-accent-foreground"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">Pendidikan Berkualitas</h3>
                                        <p className="text-muted-foreground">Kurikulum nasional yang terintegrasi dengan nilai islami</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="mt-1 bg-primary/20 p-2 rounded-full">
                                        <Calendar className="h-5 w-5 text-accent-foreground"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">Jadwal Fleksibel</h3>
                                        <p className="text-muted-foreground">Jadwal pendidikan yang fleksibel sesuai dengan kebutuhan anak</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="mt-1 bg-highlight/40 p-2 rounded-full">
                                        <Award className="h-5 w-5 text-accent-foreground"/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">Guru Berkualitas</h3>
                                        <p className="text-muted-foreground">Didukung oleh tenaga pendidik berkualitas yang memahami nilai-nilai islami</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary rounded-full -z-10"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent rounded-full -z-10"></div>
                            <Image
                                src={"https://images.pexels.com/photos/8535185/pexels-photo-8535185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                                alt="Kegiatan di TK ABA Mertosanan"
                                width={600}
                                height={50}
                                className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
