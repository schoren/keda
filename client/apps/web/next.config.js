/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: process.env.KEDA_API_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090",
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.KEDA_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
};

export default nextConfig;
