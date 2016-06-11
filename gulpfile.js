var path = require('path');

var gulp = require('gulp');
var env = require('gulp-env');
var webpack = require('webpack-stream');
var clean = require('gulp-clean');
var cache = require('gulp-cached');
// var watch = require('gulp-watch');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

var myPath = {
  app: path.resolve(__dirname, 'app'),
  dev: path.resolve(__dirname, 'dev'),
  dist: path.resolve(__dirname, 'dist'),
};

gulp.task('clean:dev', function () {
  return gulp.src(myPath.dev).pipe(clean());
});

gulp.task('clean:dist', function () {
  return gulp.src(myPath.dev).pipe(clean());
});

gulp.task('build:dev', function () {
  env({
    vars: {
      NODE_ENV: 'development',
      // WEBPACK_NO_COMPRESS: 1,
      WEBPACK_SOURCEMAP: 1
    }
  });

  var webpackConfig = require('./webpack-dev.config.js');
  Object.assign(webpackConfig, {
    colors: true
  });

  return gulp.src('./app/background.js')
  .pipe(webpack(webpackConfig))
  .pipe(gulp.dest(myPath.dev));
});

gulp.task('watch', function () {
  env({
    vars: {
      NODE_ENV: 'development',
      // WEBPACK_NO_COMPRESS: 1,
      WEBPACK_SOURCEMAP: 1
    }
  });

  var webpackConfig = require('./webpack-dev.config.js');
  Object.assign(webpackConfig, {
    watch: true,
    cache: true,
    colors: true
  });

  return gulp.src('./app/background.js')
  .pipe(webpack(webpackConfig))
  .pipe(gulp.dest(myPath.dev));
});
