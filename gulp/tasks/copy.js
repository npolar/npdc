'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var path         = require('path');

gulp.task('copy-src-html', function () {
  gulp.src(config.src.html)
    .pipe(gulp.dest(config.dist.root));
});

gulp.task('copy-src-css', function () {
  gulp.src(config.src.css)
    .pipe(gulp.dest(config.dist.root));
});

gulp.task('copy-src-config', function () {
  gulp.src(config.src.config)
    .pipe(gulp.dest(config.dist.root));
});

gulp.task('copy-asset-css', function () {
  gulp.src(config.assets.css)
    .pipe(gulp.dest(path.join(config.dist.root, 'css')));
});

gulp.task('copy-asset-html', function () {
  gulp.src(config.assets.html)
    .pipe(gulp.dest(path.join(config.dist.root, 'angular-npolar', 'html')));
});

gulp.task('copy-all', ['copy-src-html', 'copy-src-css', 'copy-src-config', 'copy-asset-css' ,'copy-asset-html']);
