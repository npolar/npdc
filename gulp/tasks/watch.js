'use strict';

var config        = require('../config');
var gulp          = require('gulp');

gulp.task('watch', ['browserSync'], function() {

  // Scripts are automatically watched and rebundled by Watchify inside Browserify task
  gulp.watch(config.src.html, ['copy']);
  gulp.watch(config.src.css, ['copy']);
  gulp.watch(config.src.config, ['copy']);
});
