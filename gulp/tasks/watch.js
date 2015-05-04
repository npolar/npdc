'use strict';

var config        = require('../config');
var gulp          = require('gulp');
var fs            = require('fs');

gulp.task('watch', ['browserSync'], function() {

  // Scripts are automatically watched and rebundled by Watchify inside Browserify task
  gulp.watch(config.src.html, ['copy-src-html']);
  gulp.watch(config.src.css, ['copy-src-css']);
  gulp.watch(config.src.config, ['copy-src-config']);

  // Watch angular-npolar if it is 'npm link'ed
  if (fs.lstatSync('./node_modules/angular-npolar').isSymbolicLink()) {
    gulp.watch(config.assets.html, ['copy-asset-html']);
  }
});
