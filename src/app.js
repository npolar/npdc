'use strict';
let angular = require('angular');
let npdcCommon = require('npdc-common');
let AutoConfig = npdcCommon.AutoConfig;

var npdc = angular.module('npdc', ['npolarApi', 'npdcUi', 'templates']);

// Auth interceptor
npdc.config(function ($httpProvider) {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});

npdc.run(function(npolarApiConfig, npdcAppConfig) {
  var environment = "test"; // development | test | production
  var autoconfig = new AutoConfig(environment);
  angular.extend(npolarApiConfig, autoconfig);
  npdcAppConfig.cardTitle = '';
  npdcAppConfig.toolbarTitle = 'NPDC';
});
