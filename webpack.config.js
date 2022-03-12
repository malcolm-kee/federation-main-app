require('dotenv').config();

const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');

const pkgJson = require('./package.json');
const dependencies = pkgJson.dependencies;

/**
 * @returns {Promise<import('webpack').Configuration>}
 */
module.exports = async (env, { mode }) => {
  const isProd = mode === 'production';

  const publicPath = sanitizePublicPath(
    process.env.VERCEL_URL ||
      process.env.PUBLIC_PATH ||
      (mode === 'development'
        ? 'http://localhost:8081/'
        : 'https://federation-main-app.vercel.app/')
  );

  return {
    mode,
    output: {
      publicPath,
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
              options: { sourceMap: true, importLoaders: 1 },
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
      new ModuleFederationPlugin({
        name: 'host',
        filename: 'remoteEntry.js',
        exposes: {},
        remotes: {
          mini: 'mini@https://federation-mini-app.vercel.app/remoteEntry.js',
          miniNext: `starterNext@${
            process.env.MINI_NEXT_URL ||
            'https://federation-mini-app-next.vercel.app'
          }/remoteEntry.js`,
          career: `career@${
            process.env.CAREER_URL || 'https://federation-career-app.vercel.app'
          }/remoteEntry.js`,
          marketing: `marketing@${
            process.env.MARKETING_URL ||
            'https://federation-marketing-app.vercel.app/'
          }/remoteEntry.js`,
        },
        shared: {
          ...dependencies,
          react: {
            singleton: true,
            requiredVersion: dependencies.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: dependencies['react-dom'],
          },
          'react-query': {
            singleton: true,
            requiredVersion: dependencies['react-query'],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin(),
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

/**
 *
 * @param {string} str
 * @returns
 */
const sanitizePublicPath = (str) => {
  const withTrailingSlash = str.endsWith('/') ? str : `${str}/`;
  return withTrailingSlash.startsWith('http')
    ? withTrailingSlash
    : `https://${withTrailingSlash}`;
};
