const path = require('path');
const webpack = require('webpack');
const toQuery = require('./lib/toQuery');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const OUTPUT_FILENAME = (function () {
  return process.env.WEBPACK_OUTPUT_FILENAME || '[name]';
})();

const params = {
  sass: {
    outputStyle: 'compressed',
    sourceComments: 'false',
    sourceMap: 'false',
    sourceMapContents: 'false',
    includePaths: [
      // encodeURIComponent(path.resolve(__dirname, "./node_modules/compass-mixins/lib/")),
      // encodeURIComponent(path.resolve(__dirname, "./app/sass/lib/"))
    ],
  },
  url: {
    // and file
    name: '[hash].[ext]',
    limit: 100,
  },
  babel: {
    cacheDirectory: true,
    presets: ['react', 'es2015', 'stage-0'],
  },
};

const myPath = {
  app: path.resolve(__dirname, 'app'),
  dist: path.resolve(__dirname, 'dist'),
};

const config = {
  context: myPath.app,
  entry: {
    contentscript: './contentscript.js',
    ytapi: './ytapi.js',

    background: './background.js',
  },
  output: {
    path: myPath.dist,
    filename: `${OUTPUT_FILENAME}.js`,
  },
  externals: {
    chrome: 'chrome',
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: [/node_modules/, path.join(myPath.app, 'lib')],
      },
    ],
    loaders: [
      { test: /\.html$/, loader: 'html', exclude: /node_modules/ },
      {
        test: /\.(png|jpg|gif)$/,
        exclude: /node_modules/,
        loaders: [
          `url?${toQuery(params.url)}`,
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loaders: [
          `url?${toQuery(params.url)}`,
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
      {
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(
          'style',
          `css?modules&importLoaders=1!postcss!sass?${toQuery(params.sass)}`
        ),
      },
      {
        test: /\.jsx?$/,
        loader: `babel?${toQuery(params.babel)}`,
        exclude: [/node_modules/],
      },
    ],
  },
  // eslint: {
  //   configFile: path.resolve(__dirname, '.eslint.yml')
  // },
  postcss() {
    return [
      // custom version of postcss-transform-shortcut
      // https://github.com/jonathantneal/postcss-transform-shortcut/issues/3
      require('./lib/postcss-transform-shortcut'),
      require('autoprefixer')('last 2 versions'),
    ];
  },
  resolve: {
    alias: {
      _lib: path.join(myPath.app, 'lib'),
      _util: path.join(myPath.app, 'util'),
      _constants: path.join(myPath.app, 'constants'),
      _actions: path.join(myPath.app, 'actions'),
      _reducers: path.join(myPath.app, 'reducers'),
      _selectors: path.join(myPath.app, 'selectors'),
      _components: path.join(myPath.app, 'components'),
      _containers: path.join(myPath.app, 'containers'),
      _app: myPath.app,
      _images: path.join(myPath.app, 'images'),
      _sass: path.join(myPath.app, 'sass'),
      'component-sass': path.join(myPath.app, 'sass', '_component-base.scss'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        YOUTUBE_API_KEY: JSON.stringify(process.env.YOUTUBE_API_KEY),
      },
    }),
    new webpack.ProvidePlugin({
      chrome: 'chrome',
    }),
    new ExtractTextPlugin(`${OUTPUT_FILENAME}.css`),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: false,
    }),
  ],
};

module.exports = config;
