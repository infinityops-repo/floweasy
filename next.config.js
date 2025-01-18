/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['juaeaocrdoaxwuybjkkv.supabase.co']
  },
  experimental: {
    webpackBuildWorker: false
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  output: 'standalone'
}

module.exports = nextConfig 