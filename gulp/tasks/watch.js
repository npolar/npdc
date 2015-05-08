'use strict';

var config = require('../config');
var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');

gulp.task('watch', ['browserSync'], function() {

  // Scripts are automatically watched and rebundled by Watchify inside Browserify task
  gulp.watch(config.src.html, ['copy-src-html']);
  gulp.watch(config.src.css, ['copy-src-css']);
  gulp.watch(config.src.config, ['copy-src-config']);
  gulp.watch(config.src.ngTemplates, ['templates']);
  gulp.watch([].concat(config.src.js, config.tests), ['test']);

  // Watch assets if 'npm link'ed
  fs.readdirSync(config.assets.root).forEach(function (file) {
    var stats = fs.lstatSync(path.join(config.assets.root, file));
    if (stats.isSymbolicLink()) {
      config.assets.css.forEach(function (glob) {
        if (glob.indexOf(file) > -1) {
          gulp.watch(glob, ['copy-asset-css']);
          gutil.log('Watching npm linked asset ' + file + ' for css changes');
        }
      });
      config.assets.ngTemplates.forEach(function (glob) {
        if (glob.indexOf(file) > -1) {
          gulp.watch(glob, ['templates']);
          gutil.log('Watching npm linked asset ' + file + ' for template changes');
        }
      });
    }
  });
});
