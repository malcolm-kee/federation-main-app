require('dotenv').config();

const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');

const pkgJson = require('./package.json');
const dependencies = pkgJson.dependencies;

/**
 * @returns {import('webpack').Configuration}
 */
module.exports = (env, { mode }) => {
  const publicPath =
    process.env.VERCEL_URL ||
    process.env.PUBLIC_PATH ||
    (mode === 'development'
      ? 'http://localhost:8081/'
      : 'https://federation-main-app.vercel.app/');

  return {
    mode,
    output: {
      publicPath,
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },

    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },

    devServer: {
      port: 8081,
      historyApiFallback: true,
    },

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

    devtool: false,

    plugins: [
      new ModuleFederationPlugin({
        name: pkgJson.federations.name,
        filename: 'remoteEntry.[contenthash].js',
        remotes: {
          mini: `starter@${
            process.env.STARTER_URL || 'https://federation-mini-app.vercel.app'
          }/remoteEntry.js`,
          miniNext:
            'starterNext@https://federation-mini-app-next.vercel.app/remoteEntry.js',
          career: `career@${
            process.env.CAREER_URL || 'https://federation-career-app.vercel.app'
          }/remoteEntry.js`,
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
            requiredVersion: dependencies['react-dom'],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin(),
      mode === 'production' && new OptimizeCssAssetsPlugin(),
      new WebpackManifestPlugin(),
    ].filter(Boolean),
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-query)[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
  };
};
