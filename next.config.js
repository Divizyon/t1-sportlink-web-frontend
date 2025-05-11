/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
    domains: [
      'static.hurriyet.com.tr',
      'i.hurimg.com',
      'img.fanatik.com.tr',
      'iasbh.tmgrup.com.tr',
      'img.internethaber.com',
      'img.superhaber.tv',
      'cdn.sporx.com',
      'assets.goal.com',
      'img.trtspor.com.tr'
    ]
  }
}

module.exports = nextConfig 