const withPlugins = require('next-compose-plugins');

const nextConfig = {
  target: 'serverless',
  webpack5: false,
  env: {
    BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:7001/v1/',
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/canvas/, /jsdom$/));
    return config;
  },
};

const plugins = [];

module.exports = withPlugins(plugins, nextConfig);
