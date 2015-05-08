'use strict';

var base = {
  'app': 'app',
  'dist': 'dist',
  'node_modules': 'node_modules'
};

var config = {

  'dist': {
    'root': base.dist,
    'assets': base.dist+'/assets',
    'shared': base.dist+'/_shared'
  },

  'src': {
    'root': base.app,
    'apps': [base.app+'/**/app.js'],
    // View templates should be required so they are included in the app bundles..
    // Make sure everything thats ng-included is copied to dist folder
    'html': [base.app+'/**/index.html'],
    'ngTemplates': [base.app+'/**/*.html'],
    'js': [base.app+'/**/*.js', '!./**/templates.js'],
    'css': [base.app+'/**/*.css'],
    'config': [base.app+'/**/*.json'],
    'shared': base.app+'/_shared'
  },

  'assets': {
    'root': base.node_modules,
    'css': [base.node_modules+'/purecss/build/pure.css', base.node_modules+'/bootstrap/dist/css/bootstrap.min.css'],
    'ngTemplates': [base.node_modules+'/angular-npolar/ui/**/*.html']
  },

  'tests': ['test/**/*Spec.js']
};

module.exports = config;
