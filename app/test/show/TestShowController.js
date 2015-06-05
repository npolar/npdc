'use strict';
/**
 * @ngInject
 */
var TestShowController = function ($scope, $controller, Dataset) {
  $controller('NpolarUiBaseController', {$scope: $scope});
  $scope.resource = Dataset;
  $scope.show();
};

module.exports = TestShowController;
