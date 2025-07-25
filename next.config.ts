import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Properti lain yang mungkin sudah Anda miliki bisa tetap ada di sini
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ["tk-aba-mertosanan.sch.id", "images.pexels.com"],
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
