/*
 * @Author: Ruoyu
 * @FilePath: \next-client\next.config.js
 */
const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withAntdLess = require('next-plugin-antd-less');

const nextConfig = {
  webpack5: false,
  target: 'serverless',
  experimental: { esmExternals: true },
  // reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:7001/v1/',
  },
};

const plugins = [] || [
  withCSS(
    withLess(
      withAntdLess({
        modifyVars: {},
        lessVarsFilePath: './assets/antd-custom.less',
        lessVarsFilePathAppendToEndOfContent: false,
        cssLoaderOptions: {},
        lessLoaderOptions: {
          javascriptEnabled: true,
        },

        webpack(config, { webpack }) {
          config.plugins.push(new webpack.IgnorePlugin(/canvas/, /jsdom$/));
          return config;
        },
      })
    )
  ),
];

module.exports = withPlugins(plugins, nextConfig);
