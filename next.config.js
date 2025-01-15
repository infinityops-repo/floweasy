/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['juaeaocrdoaxwuybjkkv.supabase.co']
  },
  experimental: {
    webpackBuildWorker: false,
    optimizeCss: true,
    forceSwcTransforms: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  distDir: '.next',
  cleanDistDir: true
}

module.exports = nextConfig 