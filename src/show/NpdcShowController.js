"use strict";

var NpdcShowController = function($scope, $location, NpdcSearchService, NpdcAutocompleteConfigFactory) {
	'ngInject';

	$scope.sections = [{},{}];
	$scope.searchOptions = new NpdcAutocompleteConfigFactory({ global: true, showCollections: false, floatingLabel: false });

  $scope.search = function(q) {
    let query = Object.assign({},
      $location.search(),
      {q : $scope.searchOptions.q});
    NpdcSearchService.globalSearch(query);
  };
};


module.exports = NpdcShowController;
