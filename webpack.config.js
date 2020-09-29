const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    },

    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },

    devServer: {
      port: 8081,
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

    plugins: [
      new ModuleFederationPlugin({
        name: 'main',
        filename: 'remoteEntry.js',
        remotes: {
          content:
            'starter@https://federation-mini-app.vercel.app/remoteEntry.js',
          contentNext:
            'starterNext@https://federation-mini-app-next.vercel.app/remoteEntry.js',
        },
        exposes: {
          './container': './src/components/container',
        },
        shared: require('./package.json').dependencies,
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin(),
    ],
  };
};
