import path from "path";
import { fileURLToPath } from "url";

/** ESM-safe __dirname */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // moved out of "experimental"
  typedRoutes: false,

  experimental: {
    // keep only supported flags
    optimizeCss: false,
  },

  compiler: {
    // ✅ fixed missing closing quote
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ ESM-safe workspace root
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
