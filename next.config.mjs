/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  env: {
    API_URL_BASE: process.env.API_URL_BASE,
    API_ENHANCED_RKA_ENDPOINT_URL: process.env.API_ENHANCED_RKA_ENDPOINT_URL,
    API_NAIVE_RKA_ENDPOINT_URL: process.env.API_NAIVE_RKA_ENDPOINT_URL,
  },
};

export default nextConfig;
