/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://172.17.118.161:3000/:path*'
      }
    ]
  }
}

module.exports = nextConfig 