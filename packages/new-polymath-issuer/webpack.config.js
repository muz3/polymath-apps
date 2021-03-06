const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getEnvVars = require('./config/envVars');
const webpackDevServer = require('./config/webpackDevServer');
// TODO @RafaelVidaurre: use => const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

envVars = getEnvVars();

module.exports = {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    '@babel/polyfill',
    path.resolve(__dirname, './src/index.tsx'),
  ],
  context: path.resolve(__dirname, '../'),
  devServer: webpackDevServer(),
  module: {
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // {
          //   test: /\.(js|jsx|mjs)$/,
          //   loader: require.resolve('source-map-loader'),
          //   enforce: 'pre',
          //   include: 'src',
          // },
          {
            test: /\.tsx?$/,
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
          },
          {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin(),
      new DeclarationBundlerPlugin({
        moduleName: '@polymathnetwork/new-issuer',
      }),
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(Object.keys(envVars)),

    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: __dirname + '/public/index.html',
    }),
    new InterpolateHtmlPlugin(envVars),
    // new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // new ForkTsCheckerWebpackPlugin({
    //   async: false,
    //   watch: 'src',
    //   tsconfig: 'tsconfig.json',
    //   tslint: 'tslint.json',
    // }),
  ],
  output: {
    pathinfo: true,
    filename: 'index.js',
    path: path.resolve(__dirname, 'build/dist'),
    publicPath: '/',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },
};
