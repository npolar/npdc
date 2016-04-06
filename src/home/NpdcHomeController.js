'use strict';

function NpdcShowController($scope, $location, $timeout,
    NpolarApiSecurity,
    npdcAppConfig, NpdcApplications, NpdcSearchService, NpdcAutocompleteConfigFactory,
    Editlog) {
  
  'ngInject';
  
  $scope.security = NpolarApiSecurity;

  $scope.sections = NpdcApplications.filter(app => app.category === 'public');
  
  $scope.documents = [{
    link: "https://data.npolar.no/policy/NP-datapolitikk.pdf",
    name: "Data policy (Norwegian)",
    img: "/home/img/open-data.jpg",
    description: ""
  }];
  $scope.apps = NpdcApplications.filter(app => app.category === 'public');
  
  if (NpolarApiSecurity.isAuthenticated()) {
    $scope.user = NpolarApiSecurity.getUser();
    Editlog.facets({q:'', 'filter-request.username': $scope.user.email}, r => {
      $scope.endpoints = r.find(f => f.facet === 'endpoint').terms.map(t => {
        return { endpoint: t.term, count: t.count }; });
    });
  }
  
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
}


module.exports = NpdcShowController;