"use strict";

angular.module("latestApp").controller("LatestController", function($scope, $filter, $location,
    npolarApiConfig, npolarApiSecurity, Nav,
    Dataset, Editlog, Expedition, Person, Placename, Project, Publication, Service, Source, Tracker) {
   
  var limit = 5;
  
  var editlog_not_endpoint = "/expedition/track|/tracking|/source|/weather/bouvet";
  
  $scope.base = npolarApiConfig.base; // Only used to flash "Fetching data from {{base}}"
  
  $scope.authors = function(people) {
    var authors = [];
    angular.forEach(people, function(p) {
      if ($filter("authorFilter")(p) !== null) {
        authors.push(p);
      }
    });
    return authors;
  };
  
  $scope.user = npolarApiSecurity.getUser();
  $scope.nav  = Nav.nav($scope.user);
  console.log($scope.nav);
  
  Dataset.array({limit: limit, sort: "-created", "not-draft": "yes"}, function(data) { $scope.new_datasets = data; });
  
  Dataset.array({limit: limit, sort: "-updated", "not-draft": "yes"}, function(data) { $scope.updated_datasets = data; });

  Expedition.array({limit: limit, sort: "-activity.departed", fields: "id,code,activity", "not-draft":"yes"}, function(data) { $scope.expeditions = data; });
  
  Tracker.array({limit: limit, sort: "-deployed", fields: "*", "filter-deployed": "1900-01-01.."+new Date().toISOString()}, function(data) { $scope.trackers = data; });
  
  Publication.array({limit: limit, sort: "-published_sort", "not-draft": "yes", fields: "id,title,people,published_sort,journal"}, function(data) { $scope.publications = data; });
  
  Project.array({limit: limit, sort: "-created", "not-draft": "yes", fields: "id,title,start_date,end_date,state"}, function(data) { $scope.projects = data; });
  
  Person.array({limit: limit, sort: "-updated", "not-currently_employed": false, "not-on_leave": true, fields: "id,name,title,orgtree,jobtitle"}, function(data) { $scope.people = data; });
  
  Editlog.array({ "filter-method": "POST", limit: limit, sort: "-request.time", "fields": "id,endpoint,identifier,path,method,request", "not-endpoint": editlog_not_endpoint}, function(data) {
    $scope.posted = data;
  });
  Editlog.array({"filter-method": "POST", limit: limit, sort: "-request.time", "fields": "id,endpoint,identifier,path,method,request", "not-endpoint": editlog_not_endpoint}, function(data) {
    $scope.edits = data;
  });
  
  Placename.array({limit: limit, sort: "created desc", "filter-approved": true, fields: "*"}, function(data) { $scope.placenames = data; });
  
  Service.array({limit: limit, sort: "-created", "filter-schema": "http://api.npolar.no/schema/api", fields: "*"}, function(data) { $scope.services = data; });
  
  Source.array({limit: limit, sort: "-created", fields: "*"}, function(data) { $scope.sources = data; });
  
});