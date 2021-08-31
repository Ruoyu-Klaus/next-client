/*
 * @Author: your name
 * @Date: 2021-07-29 18:38:13
 * @LastEditTime: 2021-08-27 16:34:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myblog\client\next.config.js
 */

const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withAntdLess = require('next-plugin-antd-less');

const nextConfig = {
  webpack5: false,
  experimental: { esmExternals: true },
  // reactStrictMode: true,
};

const plugins = [
  withCSS(
    withLess(
      withAntdLess({
        // optional
        modifyVars: {},
        // optional
        lessVarsFilePath: './assets/antd-custom.less',
        // optional
        lessVarsFilePathAppendToEndOfContent: false,
        // optional https://github.com/webpack-contrib/css-loader#object
        cssLoaderOptions: {},
        lessLoaderOptions: {
          javascriptEnabled: true,
        },

        webpack(config) {
          // config.plugins.push(
          //   new BundleAnalyzerPlugin({
          //     analyzerMode: 'static',
          //     // openAnalyzer: true,
          //   })
          // );
          return config;
        },
      })
    )
  ),
];

module.exports = withPlugins(plugins, nextConfig);
