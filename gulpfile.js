'use strict';

var gulp = require('gulp');
var npdcGulp = require('npdc-gulp');
var gulpif = require('gulp-if');
var symlink = require('gulp-symlink');
var path = require('path');
var config = npdcGulp.baseConfig;
config.COMMON_VERSION = '4.9.2';

npdcGulp.loadAppTasks(gulp);

// var parsePath = function (path) {
//   return path.split('/')[0].split('-').slice(1).join('-');
// };
//
// gulp.task('symlink', ['dev'], function () {
//   return gulp.src('../npdc-*/'+config.dist.root+'/*/')
//     .pipe(gulpif(function (file) {
//       // file.relative npdc-dataset/dist/(match)
//       let appName = parsePath(file.relative);
//       let match = file.relative.split('/').slice(-1)[0];
//       return match === appName;
//     }, symlink(function (file) {
//       return file, path.join(config.dist.root, parsePath(file.relative));
//     }, {force: true})));
// });
//
// gulp.task('default', ['symlink']);
