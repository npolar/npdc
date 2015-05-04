'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var path         = require('path');

gulp.task('copy', function () {
  var sources = [].concat(config.src.html, config.src.css, config.src.config);
  gulp.src(sources)
    .pipe(gulp.dest(config.dist.root));

  gulp.src(config.assets.css)
    .pipe(gulp.dest(path.join(config.dist.root, 'css')));

  gulp.src(config.assets.html)
    .pipe(gulp.dest(path.join(config.dist.root, 'angular-npolar', 'html')));
});
