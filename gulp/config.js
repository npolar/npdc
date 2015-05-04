'use strict';

module.exports = {

  'dist': {
    'root'  : 'dist'
  },

  'src': {
    'apps': ['./app/**/app.js'],
    'html': ['./app/**/*.html'],
    'css': ['./app/**/*.css'],
    'config': ['./app/**/*.json']
  },

  'assets': {
    'css': ['node_modules/purecss/build/pure.css', '/node_modules/bootstrap/dist/css/bootstrap.min.css'],
    'html': ['node_modules/angular-npolar/html/*']
  }
};
