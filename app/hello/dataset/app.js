'use strict';
var angular = require('angular');
var _ = require('lodash');

// Formula dependency, TODO move to formula and don't use globals...
window.tv4 = require('tv4');

// Angular modules
require('formula');
require('angular-route');
require('angular-npolar');

var npdcApp = angular.module('npdcApp', ['ngRoute', 'formula', 'npolarApi', 'npolarUi']);

// Bootstrap ngResource models using npolarApiResource
var helloResources = [
  {'path': '/user', 'resource': 'User'},
  {'path': '/dataset', 'resource': 'Dataset' }
];

helloResources.forEach(function (service) {
  npdcApp.factory(service.resource, function (npolarApiResource) {
    return npolarApiResource.resource(service);
  });
});

// Routing
npdcApp.config(require('./router'));

// Auth interceptor
npdcApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('npolarApiAuthInterceptor');
});

// Controllers
npdcApp.controller('ShowController', require('./show/show_controller'));
npdcApp.controller('SearchController', require('./search/search_controller'));
npdcApp.controller('EditController', require('./edit/edit_controller'));

// Inject config and run
npdcApp.run(function (npolarApiConfig, $http) {

  $http.get('/_shared/config/npolarApiConfig.json').success(function (config) {

    var environment = config.environment || npolarApiConfig.environment;
    angular.extend(npolarApiConfig, _.find(config.config, { environment: environment}));
    console.log('npolarApiConfig', npolarApiConfig);

  }).error(function () {
    console.log('npolarApiConfig', npolarApiConfig);
  });

});
