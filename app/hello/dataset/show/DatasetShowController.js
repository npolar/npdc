'use strict';
/**
 * @ngInject
 */
var DatasetShowController = function ($scope, $controller, Dataset) {
  $controller('NpolarUiBaseController', {$scope: $scope});
  $scope.resource = Dataset;
  $scope.show();
};

module.exports = DatasetShowController;
