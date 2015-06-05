'use strict';
var angular = require('angular');
var _ = require('lodash');

// Formula dependency, TODO move to formula and don't use globals...
window.tv4 = require('tv4');

// Angular modules
require('formula');
require('angular-route');
require('angular-npolar');
require('../_shared/templates'); // Compiled by gulp

var npdcTestApp = angular.module('npdcTestApp', ['ngRoute', 'formula', 'npolarApi', 'npolarUi', 'templates']);

// Bootstrap ngResource models using NpolarApiResource
var helloResources = [
  {'path': '/user', 'resource': 'User'},
  {'path': '/dataset', 'resource': 'Dataset' }
];

helloResources.forEach(function (service) {
  // Expressive DI syntax is needed here because of the loop..
  npdcTestApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routing
npdcTestApp.config(require('./router'));

// Auth interceptor
npdcTestApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('npolarApiAuthInterceptor');
});

// Controllers
npdcTestApp.controller('TestShowController', require('./show/TestShowController'));
npdcTestApp.controller('TestSearchController', require('./search/TestSearchController'));
npdcTestApp.controller('TestEditController', require('./edit/TestEditController'));

// Inject config and run
npdcTestApp.run(function (npolarApiConfig, $http) {

  $http.get('/_shared/config/npolarApiConfig.json').success(function (config) {

    var environment = config.environment || npolarApiConfig.environment;
    angular.extend(npolarApiConfig, _.find(config.config, { environment: environment}));
    console.log('npolarApiConfig', npolarApiConfig);

  }).error(function () {
    console.log('npolarApiConfig', npolarApiConfig);
  });

});

npdcTestApp.run(function ($templateCache) {
  console.log($templateCache.info());
  console.log("App templates loaded: " + !!$templateCache.get('hello/dataset/show/show.html'));
  console.log("angular-npolar templates loaded: " + !!$templateCache.get('angular-npolar/ui/template/_delete.html'));
  console.log("formula templates loaded: " + !!$templateCache.get('default.html'));
});
