/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'], // <-- povolené domény pre next/image
  },
};

module.exports = nextConfig;
