'use strict';

var config = require('../config');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var cachebust = require('gulp-cache-bust');
var changed = require('gulp-changed');

gulp.task('copy-src-html', function () {
  gulp.src(config.src.html)
    .pipe(changed(config.dist.root))
    .pipe(gulpif(global.isProd, cachebust()))
    .pipe(gulp.dest(config.dist.root));
});

gulp.task('copy-src-css', function () {
  gulp.src(config.src.css)
    .pipe(changed(config.dist.root))
    .pipe(gulp.dest(config.dist.root));
});

gulp.task('copy-src-config', function () {
  gulp.src(config.src.config)
    .pipe(changed(config.dist.root))
    .pipe(gulp.dest(config.dist.root));
});

gulp.task('copy-asset-css', function () {
  gulp.src(config.assets.css, { base: config.assets.root })
    .pipe(changed(config.dist.assets))
    .pipe(gulp.dest(config.dist.assets));
});

gulp.task('copy-all', ['copy-src-html', 'copy-src-css', 'copy-src-config', 'copy-asset-css']);
