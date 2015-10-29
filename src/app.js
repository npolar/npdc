'use strict';
let angular = require('angular');
let npdcCommon = require('npdc-common');
let AutoConfig = npdcCommon.AutoConfig;

require('angular-npolar');

var npdc = angular.module('npdc', ['ngRoute', 'npolarUi', 'npolarApi', 'npdcUi', 'templates']);

// Auth interceptor
npdc.config(function ($httpProvider) {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});

// Routing
npdc.config(require('./router'));

// Controllers
npdc.controller('NpdcShowController', require('./show/NpdcShowController'));
npdc.controller('GlobalSearchController', require('./search/GlobalSearchController'));

// Configure the top bar

npdc.run(function(npolarApiConfig, npdcAppConfig) {
  var environment = "test"; // development | test | production
  var autoconfig = new AutoConfig(environment);
  angular.extend(npolarApiConfig, autoconfig);
});
