/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/safety-report',
        destination: '/safety-report',
      },
      {
        source: '/work-updates',
        destination: '/work-updates',
      },
      {
        source: '/asset-scan',
        destination: '/asset-scan',
      },
    ];
  },
}

module.exports = nextConfig

