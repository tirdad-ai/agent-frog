const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");
const withNextIntl = require("next-intl/plugin")("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@repo/services",
    "@repo/database",
    "@repo/ui",
    "@repo/i18n",
  ],
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
