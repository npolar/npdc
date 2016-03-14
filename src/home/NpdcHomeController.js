"use strict";

var NpdcShowController = function($scope, $location,
  npdcAppConfig, NpdcApplications, NpdcSearchService, NpdcAutocompleteConfigFactory) {
  'ngInject';

  $scope.sections = NpdcApplications.filter(app => app.category === 'public');

  $scope.documents = [{
    link: "https://data.npolar.no/policy/NP-datapolitikk.pdf",
    name: "Data policy",
    img: "/home/img/open-data.jpg",
    description: ""
  }];
  $scope.apps = NpdcApplications.filter(app => app.category === 'public');

  $scope.searchOptions = new NpdcAutocompleteConfigFactory({
    global: true,
    showCollections: false,
    floatingLabel: false
  });

  $scope.search = function(q) {
    let query = Object.assign({},
      $location.search(), {
        q: $scope.searchOptions.q
      });
    NpdcSearchService.globalSearch(query);
  };

  $scope.icon96 = function (app) {
    return app.icons.find(icon => icon.size === 96).src;
  };
};


module.exports = NpdcShowController;
