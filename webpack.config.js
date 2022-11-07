require('dotenv').config();

const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const ExternalRemotesPlugin = require('external-remotes-plugin');

const pkgJson = require('./package.json');
const dependencies = pkgJson.dependencies;
const devDependencies = pkgJson.devDependencies;

const getPkgVersion = (pkgName) =>
  dependencies[pkgName] || devDependencies[pkgName];

/**
 * @returns {Promise<import('webpack').Configuration>}
 */
module.exports = async (env, { mode }) => {
  const isProd = mode === 'production';

  return {
    mode,
    output: {
      publicPath: '/',
      filename: isProd
        ? 'static/js/[name].[contenthash].js'
        : 'static/js/[name].js',
      chunkFilename: isProd
        ? 'static/js/[name].[contenthash].js'
        : 'static/js/[name].chunk.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },

    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },

    devServer: {
      port: 8081,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      },
      hot: false,
    },

    target: process.env.NODE_ENV === 'development' ? 'web' : 'browserslist',

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: {
                  auto: true,
                  localIdentName: isProd
                    ? '[hash:base64]'
                    : '[path][name]__[local]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },

    devtool: isProd ? 'source-map' : 'cheap-module-source-map',

    plugins: [
      new ExternalRemotesPlugin(),
      new ModuleFederationPlugin({
        name: 'host',
        filename: 'remoteEntry.js',
        exposes: {},
        remotes: {
          mini: isProd
            ? `mini@[window.appUrls?.mini]/remoteEntry.js`
            : 'mini@https://federation-mini-app.vercel.app/remoteEntry.js',
          miniNext: `starterNext@${
            process.env.MINI_NEXT_URL ||
            'https://federation-mini-app-next.vercel.app'
          }/remoteEntry.js`,
          career: isProd
            ? `career@[window.appUrls?.career]/remoteEntry.js`
            : `career@${
                process.env.CAREER_URL ||
                'https://federation-career-app.vercel.app'
              }/remoteEntry.js`,
          marketing: isProd
            ? `marketing@[window.appUrls?.marketing]/remoteEntry.js`
            : `marketing@${
                process.env.MARKETING_URL ||
                'https://federation-marketing-app.vercel.app'
              }/remoteEntry.js`,
        },
        shared: {
          '@mkeeorg/federation-ui': getPkgVersion('@mkeeorg/federation-ui'),
          react: {
            singleton: true,
            requiredVersion: getPkgVersion('react'),
          },
          'react-dom': {
            singleton: true,
            requiredVersion: getPkgVersion('react-dom'),
          },
          'react-query': {
            singleton: true,
            requiredVersion: getPkgVersion('react-query'),
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: getPkgVersion('react-router-dom'),
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash].css',
        chunkFilename: 'static/css/[name].[contenthash].css',
      }),
    ],
    optimization: {
      minimize: isProd,
      minimizer: [
        '...', // keep existing minimizer
        new CssMinimizerPlugin(),
      ],
    },
  };
};
