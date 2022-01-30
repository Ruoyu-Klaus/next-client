const withPlugins = require("next-compose-plugins");
// const withTM = require('next-transpile-modules')([
//   'three',
//   'react-three-fiber',
//   '@react-three/drei',
// ])

const nextConfig = {
  target: "serverless",
  env: {
    BASE_URL: process.env.BASE_URL || "http://127.0.0.1:7001/v1/",
  },
  webpack5: false,
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    config.plugins.push(new webpack.IgnorePlugin(/canvas/, /jsdom$/));
    return config;
  },
};

const plugins = [];
module.exports = withPlugins(plugins, nextConfig);
