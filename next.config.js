/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ Strict mode off — desktop dashboard loading loop fix
  reactStrictMode: false,

  // ❌ Remove X-Powered-By header (security)
  poweredByHeader: false,

  // ✅ FORCE non-www → www (Google OAuth LIVE fix)
  // ⚠️ Auth / Role / DB logic par koi effect nahi
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

  webpack: (config, { isServer }) => {
    if (isServer) {
      // ✅ Mongo related externals allowed
      // ❌ Prisma / Auth / Role logic untouched
      config.externals.push({
        mongoose: "commonjs mongoose",
        mongodb: "commonjs mongodb",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
