"use strict";
angular.module("npdcApp").controller("SearchController", function($scope, $location, $controller, Dataset) {
  
  $controller("NpolarApiEditController", { $scope: $scope });
  $scope.resource = Dataset;
    
  $scope.query = function() {
    var defaults = { limit: 999 };
    var invariants = { fields: "title,id,updated" };
    return angular.extend(defaults, $location.search(), invariants);
  };
  
  $scope.isWriter = function() {
    return angular.isDefined($scope.user.name);
  };

  $scope.search($scope.query());
  
});