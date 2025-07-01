import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import HomeHero from "@/components/home/HomeHero";
import StatsSection from "@/components/home/StatsSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsSection from "@/components/home/NewsSection";
import ProgramSection from "@/components/home/ProgramSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { Award, ChevronRight, Heart, Users } from "lucide-react";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HomeHero/> 

      {/* Stats Section */}
      <StatsSection />

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* News Section */}
      <NewsSection />

      {/* Program Section */}
      <ProgramSection />

      <GalleryPreview />

      <TestimonialsSection />
    </main>
  );
}
