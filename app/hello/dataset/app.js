"use strict";

angular.module("npdcApp", ["ngRoute", "formula", "npolarApi", "npolarUi"]);

// Bootstrap ngResource models using NpolarApiResource
var helloResources = [
  {"path": "/user", "resource": "User"},
  {"path": "/dataset", "resource": "Dataset" }
];
angular.forEach(helloResources, function(service) {
 angular.module("npdcApp").factory(service.resource, function(NpolarApiResource){
    return NpolarApiResource.resource(service);
  });
});

// Routing
angular.module("npdcApp").config(function($routeProvider, $locationProvider) {
 
  $locationProvider.html5Mode(true).hashPrefix('!');
 
  $routeProvider.when('/:id', {
    templateUrl: "show/show.html",
    controller: "ShowController",
    breadcrumbs: [{"href": "/path"}]}
   ).when('/:id/edit', {
    templateUrl: "edit/edit.html",
    controller: "EditController"
  }).when('/', {
    templateUrl: "search/search.html",
    controller: "SearchController"
  });
});

angular.module("npolarUiLoginLogoutDirective", []).directive('loginLogout', function() {
  return {
   scope: {},
   controller: "NpolarApiEditController",
   templateUrl: '/npolar/html/_user.html',
   link: function(scope) {
      scope.user = {};
   }
  };
});

angular.module("npdcNavDirective", []).directive('npdcNav', function() {
  return {
    //scope: { },
    templateUrl: '/npolar/html/_nav.html'
  };
});


angular.module("npolarUiBreadcrumbsDirective", []).directive('appVersion', ['version', function(user) {
  return function(scope, elm, attrs) {
    elm.text(JSON.stringify(user));
  };
}]);

angular.module("npolarUi", [
   "npolarUiBreadcrumbsDirective",
   "npolarUiLoginLogoutDirective",
   "npdcNavDirective"
]).value("version", '0.1');



// Auth interceptor
angular.module("npdcApp").config(function($httpProvider, npolarApiAuthInterceptorProvider) {
   $httpProvider.interceptors.push("npolarApiAuthInterceptor");
});

// Inject config and run
angular.module("npdcApp").run(function(npolarApiConfig, $http) {
  
  $http.get("/_shared/config/npolarApiConfig.json").success(function(config) {

    var environment = config.environment || npolarApiConfig.environment;    
    angular.extend(npolarApiConfig, _.find(config.config, { environment: environment}));
    console.log("npolarApiConfig", npolarApiConfig);
    
  }).error(function(response) {
    console.log("npolarApiConfig", npolarApiConfig);
  });
  
});