/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // remove x-powered-by header

  webpack: (config, { isServer }) => {
    if (isServer) {
      // 🔒 Vercel build time par Mongo / Mongoose ko touch na kare
      config.externals.push({
        mongoose: "commonjs mongoose",
        mongodb: "commonjs mongodb",
        fs: "commonjs fs",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
