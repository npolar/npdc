'use strict';

var gulp = require('gulp');
var npdcGulp = require('npdc-gulp');
var gulpif = require('gulp-if');
var cachebust = require('gulp-cache-bust');
var symlink = require('gulp-symlink');
var path = require('path');
var preprocess = require('gulp-preprocess');
var config = npdcGulp.baseConfig;

npdcGulp.loadAppTasks(gulp);

var parsePath = function (path) {
  return path.split('/')[0].split('-').slice(1).join('-');
};

gulp.task('symlink', ['dev'], function () {
  return gulp.src('../npdc-*/'+config.dist.root+'/*/')
    .pipe(gulpif(function (file) {
      // file.relative npdc-dataset/dist/(match)
      let appName = parsePath(file.relative);
      let match = file.relative.split('/').slice(-1)[0];
      return match === appName;
    }, symlink(function (file) {
      return file, path.join(config.dist.root, parsePath(file.relative));
    }, {force: true})));
});

gulp.task('index', ['dev'], function () {
  return gulp.src(config.src.html)
    .pipe(preprocess({
      context: {
        TOP_LEVEL: true,
        VERSION: config.version()
      }
    }))
    .pipe(gulpif(global.isProd, cachebust()))
    .pipe(gulp.dest(config.dist.root));
});

gulp.task('default', ['symlink', 'index']);
