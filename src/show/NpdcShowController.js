"use strict";

var NpdcShowController = function($scope, $location, npdcAppConfig, NpdcSearchService, NpdcAutocompleteConfigFactory) {
	'ngInject';

	$scope.sections = [{},{}];
  $scope.apps = npdcAppConfig.toolbarMenuGroups
    .reduce((memo, group) => memo.concat(group.apps), [])
    .map(app => {
      app.img = app.img.replace('48', '96');
      return app;
  });

	$scope.searchOptions = new NpdcAutocompleteConfigFactory({ global: true, showCollections: false, floatingLabel: false });

  $scope.search = function(q) {
    let query = Object.assign({},
      $location.search(),
      {q : $scope.searchOptions.q});
    NpdcSearchService.globalSearch(query);
  };
};


module.exports = NpdcShowController;
