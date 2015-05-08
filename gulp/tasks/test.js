'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var config = require('../config');

gulp.task('test', function () {
  return gulp.src(config.tests, {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({
      reporter: 'dot'
      }));
});
