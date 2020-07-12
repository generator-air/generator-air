const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: {
    'my-component': './src/index.js',
    'my-component.min': './src/index.js',
  },
  output: {
    filename: '[name].js',
    library: 'myComponent',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        include: /\.min\.js$/,
      }),
    ],
  },
};
