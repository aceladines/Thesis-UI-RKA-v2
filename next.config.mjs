/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
