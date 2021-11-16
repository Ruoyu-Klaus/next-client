const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')([
  'three',
  'react-three-fiber',
  '@react-three/drei',
])

const nextConfig = {
  target: 'serverless',
  env: {
    BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:7001/v1/',
  },
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty',
      }
    }
    config.plugins.push(new webpack.IgnorePlugin(/canvas/, /jsdom$/))
    return config
  },
}

const plugins = [withTM]
module.exports = withPlugins(plugins, nextConfig)
