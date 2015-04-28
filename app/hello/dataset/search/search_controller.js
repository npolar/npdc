'use strict';
var angular = require('angular');
/**
 * @ngInject
 */
var SearchController = function ($scope, $location, $controller, Dataset) {

  $controller('npolarApiEditController', { $scope: $scope });
  $scope.resource = Dataset;

  $scope.query = function() {
    var defaults = { limit: 999 };
    var invariants = { fields: 'title,id,updated' };
    return angular.extend(defaults, $location.search(), invariants);
  };

  $scope.isWriter = function() {
    return angular.isDefined($scope.user.name);
  };

  $scope.search($scope.query());

};

module.exports = SearchController;
