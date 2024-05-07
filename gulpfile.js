require('dotenv').config();

const path = require('path');

const gulp = require('gulp');
const env = require('gulp-env');
const webpack = require('webpack-stream');
const clean = require('gulp-clean');
const cache = require('gulp-cached');
// const watch = require('gulp-watch');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const es = require('event-stream');

const getIsFirefox = require('./lib/getIsFirefoxBranch');

const myPath = {
  app: path.resolve(__dirname, 'app'),
  dev: path.resolve(__dirname, getIsFirefox() ? 'dev-ff' : 'dev'),
  dist: path.resolve(__dirname, getIsFirefox() ? 'dist-ff' : 'dist'),
};

// env: dev, dist
const genCopyAssets = function (_env) {
  return function () {
    const images = gulp
      .src('app/images/*')
      .pipe(cache(`${_env}-images`))
      .pipe(gulp.dest(path.join(myPath[_env], 'images')));

    const locales = gulp
      .src('app/_locales/**/*')
      .pipe(cache(`${_env}-locales`))
      .pipe(gulp.dest(path.join(myPath[_env], '_locales')));

    const manifest = gulp
      .src('app/manifest.json')
      .pipe(cache(`${_env}-manifest`))
      .pipe(gulp.dest(path.join(myPath[_env])));

    let optionsUi;
    if (_env === 'dev') {
      optionsUi = gulp.src('options/dist/**/*');
    } else {
      // exclude sourcemap files
      optionsUi = gulp.src(['options/dist/**/*', '!options/dist/**/*.map']);
    }
    optionsUi.pipe(gulp.dest(path.join(myPath[_env], 'options')));

    return es.concat(images, locales, manifest, optionsUi);
  };
};

gulp.task('clean:dev', () => {
  return gulp.src(myPath.dev).pipe(clean());
});

gulp.task('clean:dist', () => {
  return gulp.src(myPath.dist).pipe(clean());
});

gulp.task('copy:dev', ['build:dev'], genCopyAssets('dev'));
gulp.task('copy:dist', ['build:dist'], genCopyAssets('dist'));

gulp.task('raw-copy:dev', genCopyAssets('dev'));
gulp.task('raw-copy:dist', genCopyAssets('dist'));

gulp.task('build:dev', ['clean:dev'], () => {
  env({
    vars: {
      NODE_ENV: 'development',
      WEBPACK_NO_COMPRESS: 1,
      WEBPACK_SOURCEMAP: 1,
    },
  });

  const webpackConfig = require('./webpack-dev.config.js');
  Object.assign(webpackConfig, {
    colors: true,
  });

  return gulp
    .src('./app/background.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(myPath.dev));
});

gulp.task('build:dist', ['clean:dist'], () => {
  env({
    vars: {
      NODE_ENV: 'production',
    },
  });

  const webpackConfig = require('./webpack-prod.config.js');
  Object.assign(webpackConfig, {
    colors: true,
  });

  return gulp
    .src('./app/background.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(myPath.dist));
});

gulp.task('build:watch', () => {
  env({
    vars: {
      NODE_ENV: 'development',
      WEBPACK_NO_COMPRESS: 1,
      WEBPACK_SOURCEMAP: 1,
    },
  });

  const webpackConfig = require('./webpack-dev.config.js');
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
gulp.task('copy:watch', () => {
  const watchOptions = {
    ignoreInitial: false,
  };
  gulp.watch(
    [
      'app/images/*',
      'app/_locales/**/*',
      'app/manifest.json',
      'options/dist/*',
    ],
    ['raw-copy:dev']
  );
});

gulp.task('watch', ['copy:watch']);
gulp.task('dev', ['clean:dev', 'build:dev', 'copy:dev']);
gulp.task('dist', ['clean:dist', 'build:dist', 'copy:dist']);
