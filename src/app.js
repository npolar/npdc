"use strict";

var angular     = require("angular");
var npdcCommon  = require("npdc-common");
var AutoConfig  = npdcCommon.AutoConfig;

var npdc = angular.module("npdcHome", ["npdcCommon"]);

// No auth interceptor

// Routing
npdc.config(require("./router"));

// Controllers
npdc.controller("NpdcShowController", require("./show/NpdcShowController"));
npdc.controller("GlobalSearchController", require("./search/GlobalSearchController"));

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  { path: '/service', 'resource': 'Service', cache: true, base: '//api.npolar.no' },
  { path: '/arcgis/rest/services', 'resource': 'ArcGIS', cache: true, base: '//geodata.npolar.no' },
];
resources.forEach(function (service) {
  // Expressive DI syntax is needed here
  npdc.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// App configurations
npdc.run(function($http, npolarApiConfig, npdcAppConfig, NpolarTranslate, NpolarLang, ArcGIS) {
  var environment = "production"; // development | test | production
  Object.assign(npolarApiConfig, new AutoConfig(environment));

  // i18n
  $http.get('//api.npolar.no/text/?q=&filter-bundle=npdc-home&format=json&variant=array&limit=all').then(response => {
    NpolarTranslate.appendToDictionary(response.data);
    NpolarLang.setLanguages(npdcAppConfig.i18n.languages);
  });

  // http://geodata.npolar.no/arcgis/rest/services/?f=pjson
  // http://geodata.npolar.no/arcgis/rest/services/inspire1?f=pjson
  ArcGIS.get({id: 'inspire1', f: 'pjson'}).$promise.then(f => {
    console.debug(f);
  });
  // Map apps =>
  // Svalbardkartet
  // Barentsportal
  // Topo?



});

// Datetime filter
npdc.filter("datetime", function() {
  return function(input, params) {
    var date = new Date(input);
    return isNaN(date.valueOf()) ? input : date.toLocaleDateString();
  };
});


/**
 * @TODO fix search results
 */
