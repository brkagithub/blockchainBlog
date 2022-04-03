const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const defaultConfig =
  /** @type {import('next').NextConfig} */
  {
    images: {
      domains: ["s7.orientaltrading.com", "image.api.playstation.com"],
    },
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: "/register",
          destination: "/login",
        },
      ];
    },
  };

module.exports = withBundleAnalyzer(defaultConfig);
