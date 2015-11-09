"use strict";

var angular     = require("angular");
var npdcCommon  = require("npdc-common");
var AutoConfig  = npdcCommon.AutoConfig;

require("angular-npolar");

var npdc = angular.module("npdcHome", ["ngRoute", "npolarUi", "npolarApi", "npdcUi", "templates"]);

// Auth interceptor
npdc.config(function ($httpProvider) {
  $httpProvider.interceptors.push("npolarApiInterceptor");
});

// Routing
npdc.config(require("./router"));

// Controllers
npdc.controller("NpdcShowController", require("./show/NpdcShowController"));
npdc.controller("GlobalSearchController", require("./search/GlobalSearchController"));

// App configurations
npdc.run(function(npolarApiConfig, npdcAppConfig) {
  var environment = "production"; // development | test | production
  var autoconfig = new AutoConfig(environment);
  angular.extend(npolarApiConfig, autoconfig);
});
