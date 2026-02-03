/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["image.tmdb.org"], // povolené domény pre next/image
  },
  eslint: {
    ignoreDuringBuilds: true, // ⬅️ toto je kľúčové
  },
};

module.exports = nextConfig;
