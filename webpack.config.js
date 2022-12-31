const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');
// const { GenerateSW } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const webpackPlugins = [
  // new WorkboxWebpackPlugin.GenerateSW({
  //   clientsClaim: true,
  //   skipWaiting: true,
  // }),
  new WorkboxWebpackPlugin.InjectManifest({
    swSrc: './src/service-worker.js',
    swDest: 'service-worker.js',
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'public/index.html'),
    filename: 'index.html',
  }),
  new Dotenv({
    path: './.env', // Path to .env file (this is the default)
    systemvars: true,
  }),
  new CopyPlugin({
    patterns: [
      { from: './public/favicon.ico', to: '' },
      { from: './public/manifest.json', to: '' },
      { from: './public/logo192.png', to: '' },
      { from: './public/logo512.png', to: '' },
    ],
  }),

  // new WorkboxWebpackPlugin.
];

// if ('production' === process.env.NODE_ENV) {
//   webpackPlugins.push(
//     new InjectManifest({
//       swSrc: './src/src-sw.js',
//       swDest: 'sw.js',
//     })
//   );
// }

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/',
    clean: true,
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
    historyApiFallback: true,
    open: true,
    overlay: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|j?g|svg|gif)?$/,
        use: 'file-loader?name=./images/[name].[ext]',
      },
    ],
  },
  resolve: {
    alias: {
      component: path.resolve(__dirname, 'src/components/'),
      context: path.resolve(__dirname, 'src/context/'),
    },
  },
  plugins: webpackPlugins,
};
