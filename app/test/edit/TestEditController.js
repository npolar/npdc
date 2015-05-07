'use strict';
/**
 * @ngInject
 */
var TestEditController = function ($scope, $controller, $routeParams, Dataset) {

  // EditController -> NpolarUiEditController
  $controller('NpolarUiEditController', { $scope: $scope });

  $scope.initFormula = function() {
    // Inject schema and form(ula)
    $scope.formula.schema = '//api.npolar.no/schema/dataset';
    $scope.formula.form = 'edit/formula.json';
    $scope.formula.template = 'bootstrap3';
  };

  // Dataset -> npolarApiResource -> ngResource
  $scope.resource = Dataset;
  $scope.initFormula();

  $scope.expert = function() {
    $scope.formula.form = null;
  };

  $scope.isExpert = function() {
    return ($scope.formula.form === null);
  };

  // edit (or new) action
  $scope.edit();

};

module.exports = TestEditController;
