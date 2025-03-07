import { NextConfig } from "next";
import { Configuration } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config: Configuration) { 
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
