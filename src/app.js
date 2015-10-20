'use strict';
let angular = require('angular');
let npdcCommon = require('npdc-common');
let AutoConfig = npdcCommon.AutoConfig;

require('angular-npolar');

var npdc = angular.module('npdc', ['npolarApi', 'npdcUi', 'templates']);

// Auth interceptor
npdc.config(function ($httpProvider) {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'Npdc'}
];

resources.forEach(function (service) {
  // Expressive DI syntax is needed here because of the loop..
  npdc.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routing
npdc.config(require('./router'));

// Controllers
npdc.controller('NpdcShowController', require('./show/NpdcShowController'));

// Configure the top bar

npdc.run(function(npolarApiConfig, npdcAppConfig) {
  var environment = "test"; // development | test | production
  var autoconfig = new AutoConfig(environment);
  angular.extend(npolarApiConfig, autoconfig);
  npdcAppConfig.toolbarTitle = 'NPDC';
});
