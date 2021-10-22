const withPlugins = require('next-compose-plugins');

const nextConfig = {
  webpack5: false,
  target: 'serverless',
  experimental: { esmExternals: true },
  // reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:7001/v1/',
  },
};

const plugins = [];

module.exports = withPlugins(plugins, nextConfig);
