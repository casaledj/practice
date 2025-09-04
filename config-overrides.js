const { override, addBabelPlugin, addWebpackModuleRule, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack'); // Import webpack

module.exports = override(
  // Add babel-plugin-module-resolver for aliases
  addBabelPlugin([
    'babel-plugin-module-resolver',
    {
      root: ['./src'],
      alias: {
        '@react-leaflet/core': '@react-leaflet/core/esm/index.js',
        'react-leaflet': 'react-leaflet/esm/index.js',
      },
    },
  ]),

  // Add a new rule to transpile react-leaflet and @react-leaflet/core
  addWebpackModuleRule({
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: [
      /node_modules\/react-leaflet/,
      /node_modules\/@react-leaflet\/core/,
    ],
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        presets: [require.resolve('babel-preset-react-app')],
        plugins: [
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-optional-chaining',
        ],
      },
    },
  }),

  // Define process.env.NODE_ENV
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    })
  )
);