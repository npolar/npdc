'use strict';

var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var config = require('../config');
var templateCache = require('gulp-angular-templatecache');
var path = require('path');

var debug = require('gulp-debug');

gulp.task('templates', function () {
  // Concatenates and registers AngularJS templates in the $templateCache
  return gulp.src(config.assets.ngTemplates, { base: path.join(process.cwd(), config.assets.root) })
    .pipe(addsrc(config.src.ngTemplates))
    .pipe(debug({minimal: false}))
    .pipe(templateCache({ moduleSystem: 'Browserify', standalone: true }))
    .pipe(gulp.dest(config.src.shared));
});
