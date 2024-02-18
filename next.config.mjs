/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/mint",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
