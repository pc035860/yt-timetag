require('dotenv').config();

var path = require('path');

var gulp = require('gulp');
var env = require('gulp-env');
var webpack = require('webpack-stream');
var clean = require('gulp-clean');
var cache = require('gulp-cached');
// var watch = require('gulp-watch');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var es = require('event-stream');

const getIsFirefox = require('./lib/getIsFirefoxBranch');

var myPath = {
  app: path.resolve(__dirname, 'app'),
  dev: path.resolve(__dirname, getIsFirefox() ? 'dev-ff' : 'dev'),
  dist: path.resolve(__dirname, getIsFirefox() ? 'dist-ff' : 'dist'),
};

// env: dev, dist
var genCopyAssets = function (env) {
  return function () {
    var images = gulp
      .src('app/images/*')
      .pipe(cache(env + '-images'))
      .pipe(gulp.dest(path.join(myPath[env], 'images')));

    var manifest = gulp
      .src('app/manifest.json')
      .pipe(cache(env + '-manifest'))
      .pipe(gulp.dest(path.join(myPath[env])));

    return es.concat(images, manifest);
  };
};

gulp.task('clean:dev', function () {
  return gulp.src(myPath.dev).pipe(clean());
});

gulp.task('clean:dist', function () {
  return gulp.src(myPath.dist).pipe(clean());
});

gulp.task('copy:dev', ['build:dev'], genCopyAssets('dev'));
gulp.task('copy:dist', ['build:dist'], genCopyAssets('dist'));

gulp.task('build:dev', ['clean:dev'], function () {
  env({
    vars: {
      NODE_ENV: 'development',
      WEBPACK_NO_COMPRESS: 1,
      WEBPACK_SOURCEMAP: 1,
    },
  });

  var webpackConfig = require('./webpack-dev.config.js');
  Object.assign(webpackConfig, {
    colors: true,
  });

  return gulp
    .src('./app/background.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(myPath.dev));
});

gulp.task('build:dist', ['clean:dist'], function () {
  env({
    vars: {
      NODE_ENV: 'production',
    },
  });

  var webpackConfig = require('./webpack-prod.config.js');
  Object.assign(webpackConfig, {
    colors: true,
  });

  return gulp
    .src('./app/background.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(myPath.dist));
});

gulp.task('build:watch', function () {
  env({
    vars: {
      NODE_ENV: 'development',
      WEBPACK_NO_COMPRESS: 1,
      WEBPACK_SOURCEMAP: 1,
    },
  });

  var webpackConfig = require('./webpack-dev.config.js');
  Object.assign(webpackConfig, {
    watch: true,
    cache: true,
    colors: true,
  });

  return gulp
    .src('./app/background.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(myPath.dev));
});
gulp.task('copy:watch', function () {
  var watchOptions = {
    ignoreInitial: false,
  };
  gulp.watch(['app/images/*', 'app/manifest.json'], ['copy:dev']);
});

gulp.task('watch', ['copy:watch']);
gulp.task('dev', ['clean:dev', 'build:dev', 'copy:dev']);
gulp.task('dist', ['clean:dist', 'build:dist', 'copy:dist']);
