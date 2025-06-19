import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Properti lain yang mungkin sudah Anda miliki bisa tetap ada di sini

  images: {
    domains: ["tk-aba-mertosanan.sch.id"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vcnqshxeuizcajluaqau.supabase.co', // GANTI JIKA PERLU
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
