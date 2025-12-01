import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    // Warning instead of error during builds
    ignoreDuringBuilds: process.env.ESLINT_SILENCE === "true",
  },
  // Add other Next.js config options here as needed
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
