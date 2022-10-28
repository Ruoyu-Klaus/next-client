const withPlugins = require('next-compose-plugins')

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
        return config
    },
    images: {
        domains: ['raw.githubusercontent.com', 'i.loli.net', 's2.loli.net']
    }
}

const plugins = []
module.exports = withPlugins(plugins, nextConfig)
