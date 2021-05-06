require('dotenv').config();

const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');

const ExternalTemplateRemotesPlugin = require('./ExternalTemplateRemotesPlugin');
const pkgJson = require('./package.json');
const dependencies = pkgJson.dependencies;
const generateRemoteConfig = require('./generate-remote-config');
const webpack = require('webpack');

/**
 * @returns {Promise<import('webpack').Configuration>}
 */
module.exports = async (env, { mode }) => {
  return {
    mode,
    output: {
      publicPath: 'auto',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
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
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },

    devtool: env === 'development' ? 'eval-cheap-source-map' : 'source-map',

    plugins: [
      new webpack.EnvironmentPlugin({
        FEDERATION_ENDPOINT:
          'https://my-json-server.typicode.com/malcolm-kee/federation-api/federations/shell',
      }),
      new ModuleFederationPlugin({
        name: pkgJson.federations.name,
        filename: 'remoteEntry.js',
        remotes: {
          mini: await generateRemoteConfig(
            process.env.MINI_URL || 'https://federation-mini-app.vercel.app',
            'mini'
          ),
          miniNext:
            'starterNext@https://federation-mini-app-next.vercel.app/remoteEntry.js',
          '@mkeeorg/career-app': `career@[window._endpoints.career]/remoteEntry.js`,
        },
        exposes: pkgJson.federations.exposes,
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
      new ExternalTemplateRemotesPlugin(),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin(),
      mode === 'production' && new OptimizeCssAssetsPlugin(),
      new WebpackManifestPlugin(),
    ].filter(Boolean),
  };
};
