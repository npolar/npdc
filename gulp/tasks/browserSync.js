'use strict';

var config      = require('../config');
var browserSync = require('browser-sync').create();
var gulp        = require('gulp');

gulp.task('browserSync', function() {

  browserSync.init({
    server: {
      baseDir: config.dist.root,
      // Watch for updates in dist, js files handled by Watchify
      files: ['dist/**/*', '!dist/**/*.js*'],
      // Enable CORS
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  });

});
