/*
 * @Author: your name
 * @Date: 2021-07-29 18:38:13
 * @LastEditTime: 2021-08-31 11:35:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
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
};

const plugins = [
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
          // config.plugins.push(
          //   new BundleAnalyzerPlugin({
          //     analyzerMode: 'static',
          //     // openAnalyzer: true,
          //   })
          // );
          config.plugins.push(new webpack.IgnorePlugin(/canvas/, /jsdom$/));
          return config;
        },
      })
    )
  ),
];

module.exports = withPlugins(plugins, nextConfig);
