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

var npdcDatasetApp = angular.module('npdcDatasetApp', ['ngRoute', 'formula', 'npolarApi', 'npolarUi', 'templates']);

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/user', 'resource': 'User'},
  {'path': '/dataset', 'resource': 'Dataset' }
];

resources.forEach(function (service) {
  // Expressive DI syntax is needed here because of the loop..
  npdcDatasetApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routing
npdcDatasetApp.config(require('./router'));

// Auth interceptor
npdcDatasetApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('npolarApiAuthInterceptor');
});

// Controllers
npdcDatasetApp.controller('DatasetShowController', require('./show/DatasetShowController'));
npdcDatasetApp.controller('DatasetSearchController', require('./search/DatasetSearchController'));
npdcDatasetApp.controller('DatasetEditController', require('./edit/DatasetEditController'));

// Inject config and run
npdcDatasetApp.run(function (npolarApiConfig, $http) {

  $http.get('/_shared/config/npolarApiConfig.json').success(function (config) {

    var environment = config.environment || npolarApiConfig.environment;
    angular.extend(npolarApiConfig, _.find(config.config, { environment: environment}));
    console.log('npolarApiConfig', npolarApiConfig);

  }).error(function () {
    console.log('npolarApiConfig', npolarApiConfig);
  });

});
