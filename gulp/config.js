'use strict';

module.exports = {

  'dist': {
    'root'  : 'dist'
  },

  'src': {
    'apps': ['./app/**/app.js'],
    // View templates should be required so they are included in the app bundles..
    // Make sure everything thats ng-included is copied to dist folder
    'html': ['app/**/index.html', './app/**/html/*.html'],
    'js': ['app/**/*.js'],
    'css': ['./app/**/*.css'],
    'config': ['./app/**/*.json']
  },

  'assets': {
    'css': ['node_modules/purecss/build/pure.css', '/node_modules/bootstrap/dist/css/bootstrap.min.css'],
    'html': ['node_modules/angular-npolar/html/*']
  }
};
