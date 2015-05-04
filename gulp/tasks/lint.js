'use strict';

var config = require('../config');
var jshint = require('gulp-jshint');
var gulp   = require('gulp');

gulp.task('lint', function() {
  return gulp.src(config.src.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    ;//.pipe(jshint.reporter('fail'));
});
