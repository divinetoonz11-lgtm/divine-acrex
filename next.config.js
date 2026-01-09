// 🔴 LOCAL ENV LOAD FIX (DO NOT COMMIT TO GIT)
require("dotenv").config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ Strict mode off — desktop dashboard loading loop fix
  reactStrictMode: false,

  // ❌ Remove X-Powered-By header (security)
  poweredByHeader: false,

  // ✅ IMPORTANT: PostCSS / CSS Modules crash fix (Vercel)
  experimental: {
    optimizeCss: false,
  },

  // ✅ FORCE non-www → www (Google OAuth LIVE fix)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "divineacres.in",
          },
        ],
        destination: "https://www.divineacres.in/:path*",
        permanent: true,
      },
    ];
  },

  // ✅ Server-side externals (Mongo safe)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        mongoose: "commonjs mongoose",
        mongodb: "commonjs mongodb",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
