'use strict';
/**
 * @ngInject
 */
var ShowController = function ($scope, $controller, Dataset) {
  $controller('npolarApiBaseController', {$scope: $scope});
  $scope.resource = Dataset;
  $scope.show();
};

module.exports = ShowController;
