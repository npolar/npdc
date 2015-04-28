"use strict";

angular.module("npdcApp").controller("ShowController", function($scope, $controller, Dataset) {
 
  $controller("NpolarApiBaseController", {$scope: $scope});
  $scope.resource = Dataset;
  $scope.show();
   
});