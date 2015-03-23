"use strict"; (function() {

  // loginApp
  // = angular (v1) app for [data.npolar.no](http://data.npolar.no/login)
  console.log("loginApp started "+ new Date().toISOString());
  
  // Init loginApp module
  var loginApp = angular.module("loginApp", [
    "ngRoute",
    "npolarApi",
    "navigation"
  ]);
  
  // Bootstrap Npolar API (ngResource) models
  var models = [
    {"path": "/nav.json", "resource": "NavResource", base: "/_shared/config" },
    {"path": "/user", "resource": "User"},
    {"path": "", "resource": "JWT", base: "https://apptest.data.npolar.no:8950"}
   
  ];
  angular.forEach(models, function(service) {
   loginApp.factory(service.resource, function(NpolarApiResource){
      return NpolarApiResource.resource(service);
    });
  });
  
  // Routes
  loginApp.config(function($routeProvider, $locationProvider) {
    
    $locationProvider.html5Mode(true).hashPrefix('!');
      
    $routeProvider
    .when('/user/:action?', { templateUrl: 'login.html', controller: 'LoginController'})
    .when('/', { templateUrl: 'login.html', controller: 'LoginController'});
    
  });
  
  // Inject auth interceptor
  loginApp.config(function($httpProvider) {
    $httpProvider.interceptors.push("npolarApiAuthInterceptor");
  });
  
  // Inject config and run
  loginApp.run(function(npolarApiConfig, $http) {
    
    $http.get("/_shared/config/npolarApiConfig.json").success(function(config) {
  
      var environment = config.environment || npolarApiConfig.environment;    
      config = _.find(config.config, { environment: environment});
      angular.extend(npolarApiConfig, config);
      console.log("npolarApiConfig", npolarApiConfig);
      
    }).error(function(response) {
      console.log("npolarApiConfig", npolarApiConfig);
    });
    
  });

}());