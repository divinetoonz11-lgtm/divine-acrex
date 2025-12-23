/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ Strict mode off — desktop dashboard loading loop fix
  reactStrictMode: false,

  // ❌ Remove X-Powered-By header (security)
  poweredByHeader: false,

  webpack: (config, { isServer }) => {
    if (isServer) {
      // ✅ Mongo related externals allowed
      // ❌ fs / prisma / auth logic ko touch nahi karta
      config.externals.push({
        mongoose: "commonjs mongoose",
        mongodb: "commonjs mongodb",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
