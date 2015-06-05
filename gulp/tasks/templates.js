'use strict';

var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var config = require('../config');
var templateCache = require('gulp-angular-templatecache');
var path = require('path');

gulp.task('templates', function () {
  // Concatenates and registers AngularJS templates in the $templateCache
  // TODO: Let angular-npolar handle this internally
  return gulp.src(config.assets.ngTemplates, { base: path.join(process.cwd(), config.assets.root, '/') })
    .pipe(addsrc(config.src.ngTemplates))
    .pipe(templateCache({ moduleSystem: 'Browserify', standalone: true }))
    .pipe(gulp.dest(config.src.shared));
});
