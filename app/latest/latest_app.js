"use strict"; (function() {

  // latestApp
  // = angular (v1) app for [data.npolar.no/home](http://data.npolar.no/home)
  var appName = "latestApp";
  var app = angular.module(appName, [
    "ngRoute",
    "npolarApi",
    "navigation"
  ]);
  console.log(appName +" started "+ new Date().toISOString());
  
  // Bootstrap NpolarApiResource (ngResource) models
  var models = [
    {"path": "/dataset", "resource": "Dataset"},
    {"path": "/editlog", "resource": "Editlog"}, 
    {"path": "/expedition", "resource": "Expedition"},
    {"path": "/person", "resource": "Person"},
    {"path": "/placename", "resource": "Placename"},
    {"path": "/project", "resource": "Project"},
    {"path": "/publication", "resource": "Publication"},
    {"path": "/service", "resource": "Service"},
    {"path": "/source", "resource": "Source"},
    {"path": "/tracking/deployment", "resource": "Tracker"},
    {"path": "/user", "resource": "User"},
    {"path": "/nav.json", "resource": "NavResource", base: "/_shared/config" }
  ];
  
  angular.forEach(models, function(service) {
   app.factory(service.resource, function(NpolarApiResource){
      return NpolarApiResource.resource(service);
    });
  });
  

  // Filters
  app.filter('authorFilter', function() {
    return function(person) {
      
      person = person || '';
      var author = _.find(person.roles, function(role) {
        return (role === "author");
      });
      
      if (author) {
        return person;
      } else {
        return null;
      }
      
    };
  });
  
  app.filter('nameFilter', function() {
    return function(person) {
      if (person != null && person.first_name != "") {
        return person.first_name +" "+person.last_name;
      } else {
        return null;
      }
    };
  });
  

  // Routes
  app.config(function($routeProvider, $locationProvider) {
    
    $locationProvider.html5Mode(true).hashPrefix('!');
      
    $routeProvider
      .otherwise({ templateUrl: 'latest.html', controller: "LatestController"});
    
  });
  
  // Inject auth interceptor
  app.config(function($httpProvider, npolarApiAuthInterceptorProvider) {
    $httpProvider.interceptors.push("npolarApiAuthInterceptor");
  });
  
  // Inject config and run
  app.run(function(npolarApiConfig, $http) {
        
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