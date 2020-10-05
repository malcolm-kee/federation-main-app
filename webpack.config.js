require('dotenv').config();

const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const dependencies = require('./package.json').dependencies;

const starterUrl =
  process.env.STARTER_URL || 'https://federation-mini-app.vercel.app';

const careerUrl =
  process.env.CAREER_URL || 'https://federation-career-app.vercel.app';

/**
 * @returns {import('webpack').Configuration}
 */
module.exports = (env, { mode }) => {
  const publicPath =
    process.env.PUBLIC_PATH ||
    (mode === 'development'
      ? 'http://localhost:8081/'
      : 'https://federation-main-app.vercel.app/');

  return {
    mode,
    output: {
      publicPath,
      path: path.resolve(__dirname, 'dist'),
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
              options: {
                hmr: mode === 'development',
              },
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
      new CleanWebpackPlugin(),
      new ModuleFederationPlugin({
        name: 'federation-demo-main',
        filename: 'remoteEntry.js',
        remotes: {
          mini: `starter@${starterUrl}/remoteEntry.js`,
          miniNext:
            'starterNext@https://federation-mini-app-next.vercel.app/remoteEntry.js',
          career: `career@${careerUrl}/remoteEntry.js`,
        },
        exposes: {
          './container': './src/components/container',
          './header': './src/components/header',
          './routes': './src/constants/routes',
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
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin(),
      mode === 'production' && new OptimizeCssAssetsPlugin(),
    ].filter(Boolean),
  };
};
