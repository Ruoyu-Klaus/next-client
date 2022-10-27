const withPlugins = require('next-compose-plugins')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const nextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:7001/v1/'
    },
    webpack: (config, {isServer}) => {
        if (isServer) {
            require('./generate-content')
        }
        config.module.rules.push({
            test: /\.md$/,
            use: 'raw-loader'
        })
        process.env.ANALYZE &&
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'server',
                    analyzerPort: isServer ? 8888 : 8889,
                    openAnalyzer: true
                }),
            ) &&
            config.plugins.push(new DuplicatePackageCheckerPlugin())

        return config
    },
    images: {
        domains: ['raw.githubusercontent.com', 'i.loli.net', 's2.loli.net']
    }
}

const plugins = []
module.exports = withPlugins(plugins, nextConfig)
